document.addEventListener("DOMContentLoaded", function() {
    const pages = document.querySelectorAll("page");
    let currentPageIndex = 0;

    function showPage(index) {
        pages.forEach((page, i) => {
            page.classList.remove("now", "next", "last");
            if (i === index) {
                page.classList.add("now");
            } else if (i === (index + 1) % pages.length) {
                page.classList.add("next");
            } else if (i === (index - 1 + pages.length) % pages.length) {
                page.classList.add("last");
            }
        });
    }

    document.querySelector(".arrow.left").addEventListener("click", (e) => {
        e.preventDefault();
        currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
        showPage(currentPageIndex);
    });

    document.querySelector(".arrow").addEventListener("click", (e) => {
        e.preventDefault();
        currentPageIndex = (currentPageIndex + 1) % pages.length;
        showPage(currentPageIndex);
    });

    // Initial display
    showPage(currentPageIndex);

    // Animation des flèches
    $('.arrow').on('click touch', function(e) {
        e.preventDefault();
        let arrow = $(this);
        if (!arrow.hasClass('animate')) {
            arrow.addClass('animate');
            setTimeout(() => {
                arrow.removeClass('animate');
            }, 1600);
        }
    });
});

