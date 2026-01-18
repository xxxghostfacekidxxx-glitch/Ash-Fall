import { getMemory, saveMemory } from "../services/memory";
import { generateReply } from "../services/chaos";

export async function handleChat(req, env) {
  const { userId, message } = await req.json();

  const memory = await getMemory(env, userId);
  const reply = generateReply(message, memory);

  await saveMemory(env, userId, reply);

  return Response.json({ reply, memory });
}
