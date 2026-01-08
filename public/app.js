import { chatbotApi } from './api/api.js';
import { initThemeToggle } from './ui/theme.js'
import { initScrollButton } from './ui/scroll.js'
import { initFormattedDate } from './ui/date.js';
import { initCopyButtons } from "./ui/copy.js";

initThemeToggle();
initScrollButton();
initFormattedDate();
initCopyButtons();

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
        console.log(chatbotResult);
        
        // 대기 중 말풍선 소멸
        await waitEndBotMessage();
        
        // 챗봇 말풍선 생성
        if (chatbotResult === null) {
            addBotMessage("현재 서버와 연결이 원활하지 않아요 😥\n잠시 후 다시 시도해 주세요.");
        }
        else if (typeof chatbotResult === "object") {
            let message = chatbotResult.cover.data.description;
            chatbotResult.contentTable.forEach((row) => {
                row.forEach((col) => {
                if (col.data && col.data.type === "button") {
                    const title = col.data.title;
                    const linkUrl = col.data.data.action.data.url;
                    message += `<br/><a href="${linkUrl}" target="_blank">${title}</a>`;
                }
                });
            });
            addBotMessage(message, "links");
        } else {
            addBotMessage(chatbotResult, "text");
        }
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

const addBotMessage = (botText, type) => {
    const chat = document.querySelector(".chatgroup")

    // 바깥 chat-div
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-div", "chat-div-left");

    // wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("bot-message-wrapper");

    // 말풍선
    const balloon = document.createElement("div");
    balloon.classList.add("ballon", "chatbot-ballon");
    if(type == "text") {
        balloon.innerText = botText;
    } else if(type == "links") {
        balloon.innerHTML = botText;
    }

    // 복사 버튼
    const copyBtn = document.createElement("button");
    copyBtn.classList.add("copy-btn");
    copyBtn.setAttribute("aria-label", "복사");

    const icon = document.createElement("i");
    icon.classList.add("far", "fa-copy");

    copyBtn.appendChild(icon);

    // 조립
    wrapper.appendChild(balloon);
    wrapper.appendChild(copyBtn);
    messageDiv.appendChild(wrapper);
    chat.appendChild(messageDiv);

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

// 우측 상단 X 버튼 동작
document.querySelector(".close-button").addEventListener('click', () => {
    document.querySelector(".modal").classList.add("modal-show");
    // 모달창 뒷부분 스크롤 막기.
    document.body.classList.add("body-hidden");
})

// 모달창 닫는 동작
document.querySelector(".modal").addEventListener('click', () => {
    document.querySelector(".modal").classList.remove("modal-show");
    document.body.classList.remove("body-hidden");
})

// 이벤트 버블링 방지.
document.querySelector(".modal-window").addEventListener('click', (event) => {
    event.stopPropagation();
})

document.querySelector("#no-button").addEventListener('click', () => {
    document.querySelector(".modal").classList.remove("modal-show");
    document.body.classList.remove("body-hidden");
})

// 대화 초기화.
document.querySelector("#yes-button").addEventListener('click', () => {
    document.querySelector(".chatgroup").innerHTML = `<div class="chat-div chat-div-center">
            <div id="chatDate" class="chat-date"></div>
        </div>
        <div class="chat-div chat-div-left">
            <div class="bot-message-wrapper">
                <div class="ballon chatbot-ballon">
                    안녕하세요! 우리FISA 챗봇입니다.<br>무엇을 도와드릴까요?
                </div>
                <button class="copy-btn" aria-label="복사">
                    <i class="far fa-copy"></i>
                </button>
            </div>
        </div>`;
    initFormattedDate();
    document.querySelector(".modal").classList.remove("modal-show");
})