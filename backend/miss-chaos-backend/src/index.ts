/**
 * Miss Chaos Worker
 * Handles personality, memory, and multiple endpoints
 */

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Helper: random mood
    const getMood = () => {
      const moods = ["grumpy", "sarcastic", "neutral", "playful", "angry"];
      return moods[Math.floor(Math.random() * moods.length)];
    };

    // Helper: JSON response
    const jsonResponse = (data: object, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
      });

    // Handle endpoints
    switch (url.pathname) {
      app.get('/message', () => {
  return new Response("Ugh, what do you want");
});
				app.post('/chat', async (req, env) => {
  const { userId, message } = await req.json();
  // memory logic here
  return Response.json({ reply });
});



        const body = await request.json();
        const userId = body.userId;
        const message = body.message;

        if (!userId || !message) {
          return jsonResponse({ error: "userId and message required" }, 400);
        }

        // Fetch previous memory from KV
        const memoryKey = `user:${userId}`;
        const memoryRaw = await env.MEMORY.get(memoryKey);
        let memory: any[] = [];
        if (memoryRaw) {
          try {
            memory = JSON.parse(memoryRaw);
            if (!Array.isArray(memory)) memory = [];
          } catch {
            memory = [];
          }
        }

        // Append new message to memory
        memory.push({ message, timestamp: new Date().toISOString() });
        await env.MEMORY.put(memoryKey, JSON.stringify(memory));

        // Personality reply
        const mood = getMood();
        const reply = `(${mood}) I see you said: "${message}"`;

        return jsonResponse({ reply, received: body, memory });

      case "/memory":
        if (request.method !== "GET") {
          return jsonResponse({ error: "GET required" }, 405);
        }
        const user = url.searchParams.get("userId");
        if (!user) return jsonResponse({ error: "userId required" }, 400);

        const memRaw = await env.MEMORY.get(`user:${user}`);
        let mem: any[] = [];
        if (memRaw) {
          try {
            mem = JSON.parse(memRaw);
            if (!Array.isArray(mem)) mem = [];
          } catch {
            mem = [];
          }
        }
        return jsonResponse({ memory: mem });

      case "/clearMemory":
        if (request.method !== "POST") {
          return jsonResponse({ error: "POST required" }, 405);
        }
        const bodyClear = await request.json();
        const clearUser = bodyClear.userId;
        if (!clearUser) return jsonResponse({ error: "userId required" }, 400);

        await env.MEMORY.delete(`user:${clearUser}`);
        return jsonResponse({ status: "Memory cleared" });

      case "/random":
        return jsonResponse({ random: crypto.randomUUID() });

      case "/health":
        return jsonResponse({ status: "ok", timestamp: new Date().toISOString() });

      default:
        return jsonResponse({ error: "Not Found" }, 404);
    }
  },
} satisfies ExportedHandler<any>;
