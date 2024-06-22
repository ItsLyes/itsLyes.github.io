// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    let currentPageIndex = 0;

    function showPage(index) {
        pages.forEach((page, i) => {
            page.classList.toggle('active', i === index);
        });
    }

    document.querySelector('.arrow.left').addEventListener('click', (e) => {
        e.preventDefault();
        currentPageIndex = (currentPageIndex > 0) ? currentPageIndex - 1 : pages.length - 1;
        showPage(currentPageIndex);
    });

    document.querySelector('.arrow:not(.left)').addEventListener('click', (e) => {
        e.preventDefault();
        currentPageIndex = (currentPageIndex < pages.length - 1) ? currentPageIndex + 1 : 0;
        showPage(currentPageIndex);
    });

    showPage(currentPageIndex);
});

