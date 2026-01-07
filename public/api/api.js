export const chatbotApi = async (payload) => {
    url = '/chat'
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        // HTTP 상태 코드 체크
        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        return data; // TODO: 수정해서 text만 전달

    } catch (error) {
        console.error('API 호출 실패:', error);
        return null;
    }
}