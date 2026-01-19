import type { Env } from "../env";


import { getMemory, saveMemory } from "../services/memory";
import { generateReply } from "../services/Chaos";

export async function handleChat(req: Request, env: Env) {
const body = await req.json() as {
  userId: string;
  message: string;
};

const { userId, message } = body;

  const memory = await getMemory(env, userId);
  const reply = generateReply(message, memory);
  await saveMemory(env, userId, reply);
  return new Response(JSON.stringify({ reply, memory }), {
    headers: { "Content-Type": "application/json" }
  });
}
