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

        // 대기 중 말풍선 생성
        waitStartBotMessage();

        const chatbotResult = await callChatbotApi(inputText);

        // 대기 중 말풍선 소멸
        await waitEndBotMessage();
        
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

// 대기 중 말풍선 생성 함수
const waitStartBotMessage = () => {
    const chat = document.querySelector(".chatgroup");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-div", "chat-div-left");

    const balloon = document.createElement("div");
    balloon.classList.add("ballon", "chatbot-ballon", "chatbot-ballon-wait");

    balloon.appendChild(document.createElement("span"));
    balloon.appendChild(document.createElement("span"));
    balloon.appendChild(document.createElement("span"));

    messageDiv.appendChild(balloon);
    chat.appendChild(messageDiv);

    messageDiv.scrollIntoView({ behavior: "smooth" });
}

// 대기 중 말풍선 소멸 함수
// Promise로 써서 소멸 되고 결과 출력 되도록 작성.
const waitEndBotMessage = () => {
    return new Promise((resolve) => {
        const waitBalloon = document.querySelector(".chatbot-ballon-wait").parentElement;
        waitBalloon.classList.add('fadeout');
        
        waitBalloon.addEventListener('animationend', () => {
            waitBalloon.remove();
            resolve();
        }, {once : true})
    })
}

let isSend = false;

// 전송 핸들러.
// 키 입력 혹은 버튼 클릭시 발동.
// 전송하는 동안 버튼 비활성화. 엔터키 입력 무효화.
const sendHandler = async (event) => {
    if(isSend) return;

    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // enter키 기본 동작인 줄바꿈 방지
        button.classList.add("send-button-hidden");
        document.querySelector("#disabled-send-button").classList.remove("send-button-hidden");
        inputTextArea.disabled = true;
        isSend = true;
        await sendMessage();
    } else if (event.target == button || event.target == document.querySelector(".fa-paper-plane")) {
        button.classList.add("send-button-hidden");
        document.querySelector("#disabled-send-button").classList.remove("send-button-hidden");
        inputTextArea.disabled = true;
        isSend = true;
        await sendMessage();
    }

    isSend = false;
    button.classList.remove("send-button-hidden");
    document.querySelector("#disabled-send-button").classList.add("send-button-hidden");
    inputTextArea.disabled = false;
}

// enter키 이벤트 핸들러
inputTextArea.addEventListener('keydown', sendHandler)

// button 이벤트 핸들러
button.addEventListener('click', sendHandler);



// dark mode
document.getElementById("themeToggle")
    .addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });

// 플로팅 버튼
const chat = document.querySelector(".chatgroup");
const scrollBtn = document.getElementById("scrollBottomBtn");

const isScrolledToBottom = () => {
    // 스크롤 가능한 전체 길이
    const totalScrollableHeight = document.body.scrollHeight - window.innerHeight;
    
    // 현재 스크롤 위치
    const currentScroll = window.scrollY;

    // 아래 30% 이내인지 판별
    return (currentScroll / totalScrollableHeight) >= 0.7;
};

window.addEventListener("scroll", () => {
    if (isScrolledToBottom()) {
        scrollBtn.style.display = "none";
    } else {
        scrollBtn.style.display = "block";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth",
    });
});