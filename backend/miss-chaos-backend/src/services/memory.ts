export async function getMemory(env: any, userId: string) {
  const mem = await env.MEMORY.get(userId);
  return mem ? JSON.parse(mem) : [];
}

export async function saveMemory(env: any, userId: string, reply: string) {
  const mem = await getMemory(env, userId);
  const updated = [...mem, reply];
  await env.MEMORY.put(userId, JSON.stringify(updated));
  return updated;
}

