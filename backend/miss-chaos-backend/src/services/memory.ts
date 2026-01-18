export async function getMemory(env, userId) {
  return (await env.MEMORY.get(userId, { type: "json" })) ?? [];
}

export async function saveMemory(env, userId, entry) {
  const memory = await getMemory(env, userId);
  memory.push(entry);
  await env.MEMORY.put(userId, JSON.stringify(memory));
}
