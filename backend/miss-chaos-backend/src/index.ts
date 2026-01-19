import type { Env } from "./env";



import { handleChat } from "./routes/chat";
import { handleRandom } from "./routes/random";

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/message") {
      return handleChat(req, env);
    }

    if (url.pathname === "/random") {
      return handleRandom();
    }

    return new Response("Not Found", { status: 404 });
  }
};
