import { createApp } from "./app.ts";
import { config } from "./config/index.ts";

const app = createApp({ corsOrigins: config.CORS_ORIGIN });

app.listen(config.PORT, () => {
  console.log(`SeenFlix API listening on http://localhost:${config.PORT} (${config.NODE_ENV})`);
});
