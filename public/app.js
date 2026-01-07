import { chatbotApi } from './api/api.js';

//addEventListener() // 버튼 클릭 -> input 긁어와서 api 요청 보내기
const inputTextArea = document.getElementById('send-message')
const button = document.querySelector('.send-button')

const sendMessage = async () => {
        const inputText = inputTextArea.value.trim();
        console.log("inputText:", inputText);
    
        // 입력값이 공백일 경우 버튼 클릭 무시
        if (!inputText) return;
    
        // 사용자 말풍선 생성
        addUserMessage(inputText);
    
        // 입력창 초기화
        inputTextArea.value = "";
        const chatbotResult = await callChatbotApi(inputText);
    
        // 챗봇 말풍선 생성
        if (chatbotResult === null) {
            addBotMessage("현재 챗봇 응답이 불가능합니다.");
            return;
        }
        addBotMessage(chatbotResult);
    }

const callChatbotApi = async (inputText) => {
    const payload = {
        text: inputText
    };

    // 챗봇 API 호출
    return await chatbotApi(payload);
}

const addUserMessage = (userText) => {
    const chat = document.querySelector(".chatgroup")

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-div", "chat-div-right");

    const balloon = document.createElement("div");
    balloon.classList.add("ballon", "user-ballon")

    balloon.innerText = userText;

    messageDiv.appendChild(balloon)
    chat.appendChild(messageDiv)
    // 스크롤 맨 아래로 이동
    chat.scrollTop = chat.scrollHeight;

    messageDiv.scrollIntoView({ behavior: "smooth" });
}

const addBotMessage = (botText) => {
    const chat = document.querySelector(".chatgroup")

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-div", "chat-div-left");

    const balloon = document.createElement("div");
    balloon.classList.add("ballon", "chatbot-ballon")

    balloon.innerText = botText;

    messageDiv.appendChild(balloon)
    chat.appendChild(messageDiv)

    messageDiv.scrollIntoView({ behavior: "smooth" });
}

// enter키 이벤트 핸들러
inputTextArea.addEventListener('keydown', (event) => {
    // enter와 shift키를 같이 눌렀을 때는 줄바꿈으로 생각
    // enter만 눌렀을 때
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // enter키 기본 동작인 줄바꿈 방지
        sendMessage();
    }
})

// button 이벤트 핸들러
button.addEventListener('click', sendMessage);

document.getElementById("themeToggle")
    .addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
