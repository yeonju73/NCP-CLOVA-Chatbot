export const chatbotApi = async (payload) => {
  const url = "/chat";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);

    const data = await response.json();

    if (data && data.bubbles && data.bubbles[0]) {
      const bubble = data.bubbles[0];

      // 1. 일반 텍스트 답변 처리
      if (bubble.type === "text") {
        return bubble.data.description;
      }

      // 2. 멀티링크(템플릿) 답변 처리
      if (bubble.type === "template") {
        let message = bubble.data.cover.data.description; // "Chatbot Answer" 부분

        // 링크 버튼들이 있는 경우 텍스트 뒤에 붙여줌
        if (bubble.data.contentTable) {
          bubble.data.contentTable.forEach((row) => {
            row.forEach((col) => {
              if (col.data && col.data.type === "button") {
                const linkUrl = col.data.data.action.data.url;
                message += `\n- ${linkUrl}`;
              }
            });
          });
        }
        return message;
      }
    }
    return "응답 형식이 올바르지 않습니다.";
  } catch (error) {
    console.error("API 호출 실패:", error);
    return null;
  }
};
