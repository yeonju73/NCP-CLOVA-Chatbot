import express from 'express';
import { sendToChatbot } from './public/app.js';

const app = express();
app.use(express.static('public'));
app.use(express.json());

// 챗봇 대화 요청 엔드포인트
app.post('/chat', async (req, res) => {
  try {
    const { content } = req.body;
    console.log('클라이언트 메시지:', content); // 요청 확인 로그

    const result = await sendToChatbot(content);
    res.json(result);
  } catch (error) {
    // 에러의 상세 내용을 서버 터미널에 출력합니다.
    console.error('===== 서버 에러 상세 발생 =====');
    console.error(error);
    console.error('==============================');

    res.status(500).json({
      message: '서버 내부 오류 발생',
      detail: error.message
    });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

