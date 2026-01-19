export default {
  async fetch(request, env) {
    // simple response to confirm worker is live
    return new Response("risefromtheashes Worker is running", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
