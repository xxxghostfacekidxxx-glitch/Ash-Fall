import { getMemory, saveMemory } from "../services/memory";
import { generateReply } from "../services/Chaos";

// Generate a random UUID for /random endpoint
function generateRandomUUID() {
  return crypto.randomUUID();
}

export async function handleRequest(req, env) {
  const url = new URL(req.url);

  if (url.pathname === "/message" && req.method === "POST") {
    const { userId, message } = await req.json();

    const memory = await getMemory(env, userId);
    const reply = generateReply(message, memory);

    await saveMemory(env, userId, reply);

    return new Response(JSON.stringify({ reply, memory }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (url.pathname === "/random" && req.method === "GET") {
    return new Response(JSON.stringify({ random: generateRandomUUID() }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Default fallback
  return new Response("Not found", { status: 404 });
}
