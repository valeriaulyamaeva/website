document.addEventListener("DOMContentLoaded", () => {
    const serviceArticles = document.querySelectorAll(".service");

    serviceArticles.forEach(service => {
        const btn = service.querySelector(".expand-btn");
        const content = service.querySelector(".service-content");

        btn.addEventListener("click", () => {
            const isExpanded = service.classList.toggle("expanded");
            btn.textContent = isExpanded ? "−" : "+";
        });
    });
});
