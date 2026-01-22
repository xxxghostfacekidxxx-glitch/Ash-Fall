import manifest from "__STATIC_CONTENT_MANIFEST";

const assetManifest = JSON.parse(manifest);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API route example
    if (url.pathname.startsWith("/api")) {
      return new Response(
        JSON.stringify({ status: "Miss Chaos online" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Static file handling
    let path = url.pathname === "/" ? "/index.html" : url.pathname;

    if (assetManifest[path.slice(1)]) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};