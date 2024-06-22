document.addEventListener("DOMContentLoaded", function() {
    const pages = document.querySelectorAll("page");
    let currentPageIndex = 0;

    function showPage(index) {
        pages.forEach((page, i) => {
            page.classList.remove("now", "next", "last");
            if (i === index) {
                page.classList.add("now");
            } else if (i === index + 1) {
                page.classList.add("next");
            } else if (i === index - 1) {
                page.classList.add("last");
            }
        });
    }

    function nextPage() {
        currentPageIndex = (currentPageIndex + 1) % pages.length;
        showPage(currentPageIndex);
    }

    function previousPage() {
        currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
        showPage(currentPageIndex);
    }

    document.querySelector("#nextButton").addEventListener("click", nextPage);
    document.querySelector("#prevButton").addEventListener("click", previousPage);

    showPage(currentPageIndex);
});

