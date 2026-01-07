import express from 'express';
import { sendToChatbot } from './public/app.js';

const app = express();
app.use(express.static('public'));
app.use(express.json());

// 챗봇 대화 요청 엔드포인트
app.post('/chat', async (req, res) => {
    try {
        const { content } = req.body;
        const result = await sendToChatbot(content);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));