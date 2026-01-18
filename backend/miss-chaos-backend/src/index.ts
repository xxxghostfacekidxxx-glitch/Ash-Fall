import { handleHealth } from "./routes/health";
import { handleMessage } from "./routes/message";
import { handleChat } from "./routes/chat";

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/health") return handleHealth();
    if (url.pathname === "/message") return handleMessage();
    if (url.pathname === "/chat" && req.method === "POST")
      return handleChat(req, env);

    return new Response("Not found", { status: 404 });
  }
};

