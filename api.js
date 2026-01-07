import HTTP from "superagent";
import dotenv from "dotenv";

dotenv.config();

const CLOVA_SECRET_KEY = "process.env.CLOVA_SECRET_KEY";
const CLOVA_URL = "process.env.CLOVA_URL";

export async function chatbotApi(payload) {
  const signature = crypto
    .createHmac("sha256", CLOVA_SECRET_KEY)
    .update(JSON.stringify(payload), "utf8")
    .digest("base64");

  const result = await HTTP.post(CLOVA_URL)
    .send(payload)
    .set("Content-Type", "application/json")
    .set("X-NCP-CHATBOT_SIGNATURE", signature);

  const responseDataFromClova = result.body;

  const answer = responseDataFromClova.bubbles[0].data.description;

  const responseData = { answer };

  return responseData;
}
