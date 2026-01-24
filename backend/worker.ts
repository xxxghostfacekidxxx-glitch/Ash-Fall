// worker.ts - Add this to your existing Cloudflare Worker

interface Env {
  FORUM_KV: KVNamespace;
}

// Simple auth helpers
function generateToken(): string {
  return crypto.randomUUID();
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyToken(env: Env, token: string): Promise<any> {
  const session = await env.FORUM_KV.get(`session:${token}`);
  if (!session) return null;
  return JSON.parse(session);
}

// CORS helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    try {
      // Auth endpoints
      if (path === '/api/auth/signup' && request.method === 'POST') {
        const { username, password, email } = await request.json() as any;

        // Check if user exists
        const existing = await env.FORUM_KV.get(`user:${username}`);
        if (existing) {
          return new Response(JSON.stringify({ error: 'Username already exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const hashedPassword = await hashPassword(password);
        const user = {
          username,
          email,
          password: hashedPassword,
          createdAt: Date.now()
        };

        await env.FORUM_KV.put(`user:${username}`, JSON.stringify(user));

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }

      if (path === '/api/auth/login' && request.method === 'POST') {
        const { username, password } = await request.json() as any;

        const userStr = await env.FORUM_KV.get(`user:${username}`);
        if (!userStr) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const user = JSON.parse(userStr);
        const hashedPassword = await hashPassword(password);

        if (user.password !== hashedPassword) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const token = generateToken();
        await env.FORUM_KV.put(`session:${token}`, JSON.stringify({ username }), {
          expirationTtl: 86400 * 7 // 7 days
        });

        return new Response(JSON.stringify({
          token,
          user: { username: user.username, email: user.email }
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }

      // Get all threads
      if (path === '/api/threads' && request.method === 'GET') {
        const threadList = await env.FORUM_KV.get('threads:list');
        const threads = threadList ? JSON.parse(threadList) : [];

        // Sort by date, newest first
        threads.sort((a: any, b: any) => b.createdAt - a.createdAt);

        return new Response(JSON.stringify(threads), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }

      // Create new thread
      if (path === '/api/threads' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const token = authHeader.replace('Bearer ', '');
        const session = await verifyToken(env, token);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const { title, content } = await request.json() as any;
        const threadId = crypto.randomUUID();

        const thread = {
          id: threadId,
          title,
          content,
          author: session.username,
          createdAt: Date.now(),
          votes: 0,
          replyCount: 0,
          replies: []
        };

        // Store thread
        await env.FORUM_KV.put(`thread:${threadId}`, JSON.stringify(thread));

        // Update thread list
        const threadList = await env.FORUM_KV.get('threads:list');
        const threads = threadList ? JSON.parse(threadList) : [];
        threads.push({
          id: thread.id,
          title: thread.title,
          content: thread.content,
          author: thread.author,
          createdAt: thread.createdAt,
          votes: thread.votes,
          replyCount: thread.replyCount
        });
        await env.FORUM_KV.put('threads:list', JSON.stringify(threads));

        return new Response(JSON.stringify(thread), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }

      // Get single thread
      if (path.startsWith('/api/threads/') && !path.includes('/replies') && !path.includes('/vote') && request.method === 'GET') {
        const threadId = path.split('/')[3];
        const threadStr = await env.FORUM_KV.get(`thread:${threadId}`);

        if (!threadStr) {
          return new Response(JSON.stringify({ error: 'Thread not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        return new Response(threadStr, {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }

      // Post reply
      if (path.match(/\/api\/threads\/[^\/]+\/replies/) && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const token = authHeader.replace('Bearer ', '');
        const session = await verifyToken(env, token);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const threadId = path.split('/')[3];
        const { content } = await request.json() as any;

        const threadStr = await env.FORUM_KV.get(`thread:${threadId}`);
        if (!threadStr) {
          return new Response(JSON.stringify({ error: 'Thread not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const thread = JSON.parse(threadStr);
        const reply = {
          id: crypto.randomUUID(),
          author: session.username,
          content,
          createdAt: Date.now()
        };

        thread.replies = thread.replies || [];
        thread.replies.push(reply);
        thread.replyCount = thread.replies.length;

        await env.FORUM_KV.put(`thread:${threadId}`, JSON.stringify(thread));

        // Update thread list
        const threadList = await env.FORUM_KV.get('threads:list');
        const threads = threadList ? JSON.parse(threadList) : [];
        const threadIndex = threads.findIndex((t: any) => t.id === threadId);
        if (threadIndex !== -1) {
          threads[threadIndex].replyCount = thread.replyCount;
          await env.FORUM_KV.put('threads:list', JSON.stringify(threads));
        }

        return new Response(JSON.stringify(reply), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }

      // Vote on thread
      if (path.match(/\/api\/threads\/[^\/]+\/vote/) && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const token = authHeader.replace('Bearer ', '');
        const session = await verifyToken(env, token);
        if (!session) {
          return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const threadId = path.split('/')[3];
        const { direction } = await request.json() as any;

        const threadStr = await env.FORUM_KV.get(`thread:${threadId}`);
        if (!threadStr) {
          return new Response(JSON.stringify({ error: 'Thread not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
          });
        }

        const thread = JSON.parse(threadStr);
        
        // Simple vote tracking (in production, track per user)
        const voteKey = `vote:${threadId}:${session.username}`;
        const existingVote = await env.FORUM_KV.get(voteKey);

        if (existingVote) {
          // User already voted, change their vote
          thread.votes = (thread.votes || 0) - parseInt(existingVote) + direction;
        } else {
          // New vote
          thread.votes = (thread.votes || 0) + direction;
        }

        await env.FORUM_KV.put(voteKey, direction.toString());
        await env.FORUM_KV.put(`thread:${threadId}`, JSON.stringify(thread));

        // Update thread list
        const threadList = await env.FORUM_KV.get('threads:list');
        const threads = threadList ? JSON.parse(threadList) : [];
        const threadIndex = threads.findIndex((t: any) => t.id === threadId);
        if (threadIndex !== -1) {
          threads[threadIndex].votes = thread.votes;
          await env.FORUM_KV.put('threads:list', JSON.stringify(threads));
        }

        return new Response(JSON.stringify({ votes: thread.votes }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }

      return new Response('Not found', { status: 404 });

    } catch (err) {
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }
  }
};