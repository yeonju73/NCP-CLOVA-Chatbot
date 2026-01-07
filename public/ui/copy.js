export const initCopyButtons = () => {
    document.addEventListener("click", async (e) => {
        const btn = e.target.closest(".copy-btn");
        if (!btn) return;

        const text = btn.previousElementSibling.innerText;

        try {
            await navigator.clipboard.writeText(text);
            btn.innerHTML = '<i class="fas fa-check"></i>';

            setTimeout(() => {
                btn.innerHTML = '<i class="far fa-copy"></i>';
            }, 1000);
        } catch (err) {
            alert("복사에 실패했습니다.");
        }
    });
};
