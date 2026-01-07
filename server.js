import express, { json } from "express";
import { chatbotApi } from "./public/api/api.js";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(json());

app.post("/chatbot", async (request, response) => {
  const { userId = "demo-user", text } = request.body;

  const payload = {
    version: "v2",
    userId,
    timestamp: Date.now(),
    bubbles: [
      {
        type: "text",
        data: { description: text },
      },
    ],
    event: "send",
  };

  const result = await chatbotApi(payload);

  response.send(result);
});

app.listen(PORT, () =>
  console.log(`Express 서버가 http://localhost:${PORT} 에서 대기중`)
);
