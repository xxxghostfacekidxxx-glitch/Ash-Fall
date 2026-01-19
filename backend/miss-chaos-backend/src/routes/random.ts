export async function handleRandom() {
  const uuid = crypto.randomUUID();
  return new Response(JSON.stringify({ random: uuid }), {
    headers: { "Content-Type": "application/json" }
  });
}

