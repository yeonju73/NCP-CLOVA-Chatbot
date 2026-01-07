import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// NCP 콘솔에서 확인한 정보를 .env에 저장하세요
const INVOKE_URL = process.env.CHATBOT_INVOKE_URL;
const SECRET_KEY = process.env.CHATBOT_INVOKE_SECRET;

console.log('로드된 URL:', INVOKE_URL);
console.log('로드된 KEY 존재여부:', SECRET_KEY ? 'Yes' : 'No');

export async function sendToChatbot(text) {
    const timestamp = Date.now();

    // API 명세에 따른 Signature 생성
    const body = {
        version: "v2",
        userId: "test-user", // 고유 사용자 ID
        timestamp: timestamp,
        bubbles: [{
            type: "text",
            data: { description: text }
        }],
        event: "send"
    };

    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(JSON.stringify(body))
        .digest('base64');

    const response = await axios.post(INVOKE_URL, body, {
        headers: {
            'Content-Type': 'application/json',
            'X-NCP-CHATBOT_SIGNATURE': signature
        }
    });

    return response.data;
}
