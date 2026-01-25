export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/") {
      return new Response(
        "risefromtheashes Worker is alive",
        { status: 200 }
      );
    }

    // Proxy to Miss Chaos backend
    if (url.pathname.startsWith("/api")) {
      const backendURL = "https://miss-chaos-backend.knightfall-450.workers.dev";

      const target = backendURL + url.pathname.replace("/api", "");

      const response = await fetch(target, {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" ? await request.clone().arrayBuffer() : null
      });

      return response;
    }

    return new Response("Not found", { status: 404 });
  }
};
export default {
  async fetch(request, env) {
    // simple response to confirm worker is live
    return new Response("risefromtheashes Worker is running", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};

