import { createApp } from "./app.ts";
import { loadConfig } from "./config/index.ts";

const config = loadConfig();

const app = createApp({ corsOrigins: config.CORS_ORIGIN });

app.listen(config.PORT, () => {
  console.log(`SeenFlix API listening on http://localhost:${config.PORT} (${config.NODE_ENV})`);
});
