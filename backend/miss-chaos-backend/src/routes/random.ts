export async function onRequestGet(context) {
    // generate a random UUID
    const uuid = crypto.randomUUID();
    return new Response(JSON.stringify({ random: uuid }), {
        headers: { "Content-Type": "application/json" }
    });
}
