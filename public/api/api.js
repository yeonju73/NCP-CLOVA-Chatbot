export const chatbotApi = async (payload) => {
    const url = '/chat';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);

        const data = await response.json();

        if (data && data.bubbles && data.bubbles[0]) {
            return data.bubbles[0].data.description;
        }
        return "응답 형식이 올바르지 않습니다.";

    } catch (error) {
        console.error('API 호출 실패:', error);
        return null;
    }
}