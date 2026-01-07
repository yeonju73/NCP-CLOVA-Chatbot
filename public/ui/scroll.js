export const initScrollButton = () => {
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
};