export const initFormattedDate = async () => {
    const data = document.getElementById("chatDate");
    const today = new Date();
    const formattedDate = today.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    
    data.textContent = formattedDate;
}