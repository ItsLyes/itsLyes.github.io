function triangle(id, amount, duration, color) {
    const canvas = document.getElementById(id);
    const context = canvas.getContext("2d");
    let width, height;

    adjustCanvas(canvas);
    window.onresize = () => adjustCanvas(canvas);

    function adjustCanvas(canvas) {
        const r = canvas.getBoundingClientRect();
        width = canvas.width = r.width;
        height = canvas.height = r.height;

        context.globalAlpha = 0.1;
        context.strokeStyle = color;
    }

    let points = [];

    window.requestAnimationFrame(draw);

    let last = null;
    let respawn = 0;

    function draw(timestamp) {
        if (last == null) {
            last = timestamp;
            window.requestAnimationFrame(draw);
            return;
        }

        const delta = (timestamp - last) / 1000;
        last = timestamp;

        const newPoints = [];
        for (let [x, y, sx, sy, live] of points) {
            live -= delta;
            if (live <= 0) continue;

            x += sx * (Math.random() - 0.01) * 2;
            y += sy * (Math.random() - 0.01) * 2;

            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            newPoints.push([x, y, sx, sy, live]);
        }

        if (newPoints.length < amount && last - respawn > 100) {
            const x = Math.random() * width;
            const y = Math.random() * height;

            const sx = (Math.random() - 0.5) * 0.5;
            const sy = (Math.random() - 0.5) * 0.5;

            newPoints.push([x, y, sx, sy, duration]);

            respawn = last;
        }
        points = newPoints;

        context.clearRect(0, 0, width, height);

        for (const p1 of points) {
            const dis = [];
            const [x1, y1] = p1;
            for (const p2 of points) {
                if (p1 == p2) continue;
                const [x2, y2] = p2;
                const d = (x1 - x2) ** 2 + (y1 - y2) ** 2;
                dis.push([x2, y2, d]);
            }
            if (dis.length < 5) continue;

            dis.sort((a, b) => a[2] - b[2]);
            const near = dis.slice(0, 5);
            for (const [x2, y2, d] of near) {
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }
        }

        window.requestAnimationFrame(draw);
    }
}

function formatText(text) {
    let nt = text;
    for (const [w, code] of text.matchAll(/`(.*?)`/g)) {
        let res = code;
        if (code[0] == "$") {
            if (code == "$age") {
                res = Math.floor((Date.now() - 1093989600000) / 31536000000);
            }
        }
        nt = nt.replace(w, "<code>" + res + "</code>");
    }
    return nt;
}

let cu = null;
let pg;

window.onload = async () => {
    await pinned();

    const pages = document.querySelectorAll("page");

    const hash = window.location.hash;
    if (hash.startsWith("#page")) {
        const p = parseInt(hash.slice(5)) - 1;
        cu = (p >= 0 && p < pages.length) ? p : 0;
    } else {
        cu = 0;
    }

    pages.forEach((p, i) => {
        if (i < cu) p.classList.add("last");
        else p.classList.add("next");
        const t = p.querySelector(".text");
        for (const span of t.querySelectorAll("span")) {
            span.innerHTML = formatText(span.innerHTML);
        }
        const more = document.createElement("span");
        more.classList.add("more", "link");
        if (i < pages.length - 1) {
            more.setAttribute("ricon", "arrow-down-line");
            more.onclick = () => page(i + 1);
        } else {
            more.classList.remove("link");
            more.setAttribute("ricon", "check-line");
        }
        if (i != 0) {
            const before = document.createElement("span");
            before.classList.add("before", "link");
            before.setAttribute("ricon", "arrow-up-line");
            before.onclick = () => page(i - 1);
            t.appendChild(before);
        }
        t.appendChild(more);
    });
    pg = pages;

    const micons = document.querySelectorAll("[micon]");
    for (const icon of micons) {
        const i = document.createElement("span");
        i.classList.add("material-symbols-outlined");
        i.classList.add("micon");
        i.innerText = icon.getAttribute("micon");
        icon.insertBefore(i, icon.firstChild);
        icon.removeAttribute("micon");
    }

    const dicons = document.querySelectorAll("[dicon]");
    for (const icon of dicons) {
        const i = document.createElement("i");
        i.classList.add("devicon-" + icon.getAttribute("dicon"));
        i.classList.add("dicon");
        icon.insertBefore(i, icon.firstChild);
        icon.removeAttribute("dicon");
    }

    const ricons = document.querySelectorAll("[ricon]");
    for (const icon of ricons) {
        const i = document.createElement("i");
        i.classList.add("ri-" + icon.getAttribute("ricon"));
        i.classList.add("ricon");
        icon.insertBefore(i, icon.firstChild);
        icon.removeAttribute("ricon");
    }

    page(cu);
    triangle("draw", 100, 10, "#47a898");
};

function link(l) {
    window.open(l, "_blank").focus();
}

async function pinned() {
    const pinned = await fetch("/pinned.json");
    const data = await pinned.json();

    const pins = document.getElementById("pinned");
    const divs = [];
    for (const [q, title, desc] of data) {
        const div = document.createElement("div");
        div.classList.add("hidden", "content", "x");
        div.innerHTML = '<h3 class="header">' + title + '</h3>' +
            '<div class="text"><span>' + desc.replaceAll("\n", "<br>") +
            '</span><span class="pin link" ricon="pushpin-line" onclick="link(\'/q/' + q + '\')"></span></div>';
        divs.push(div);
        pins.appendChild(div);
    }
    divs[0].classList.remove("hidden", "x");
    divs[0].classList.add("shown");

    let index = 0;
    let step = 0;
    let last = null;
    function slide(timestamp) {
        if (last == null) {
            last = timestamp;
            window.requestAnimationFrame(slide);
            return;
        }
        const delta = (timestamp - last) / 1000;

        if (step == 0) {
            if (delta >= 5) {
                divs[index].classList.remove("shown");
                divs[index].classList.add("hidden");
                step = 1;
                last = timestamp;
            }
        } else if (step == 1) {
            if (delta >= 1) {
                divs[index].classList.add("x");
                index = (index + 1) % divs.length;
                divs[index].classList.remove("hidden", "x");
                divs[index].classList.add("shown");
                step = 0;
                last = timestamp;
            }
        }

        window.requestAnimationFrame(slide);
    }
    window.requestAnimationFrame(slide);
}

function page(to) {
    window.location.hash = "page" + (to + 1);

    const f = pg[cu];
    if (f) {
        f.classList.remove("now");
        f.classList.add(cu < to ? "last" : "next");
    }
    const t = pg[to];
    if (t) {
        t.classList.remove("last");
        t.classList.remove("next");
        t.classList.add("now");
    }
    cu = to;
}

// Ajout de la fonction pour les flèches
$('.arrow').on('click touch', function(e) {
    e.preventDefault();

    let arrow = $(this);

    if (!arrow.hasClass('animate')) {
        arrow.addClass('animate');
        setTimeout(() => {
            arrow.removeClass('animate');
        }, 1600);

        if (arrow.hasClass('left')) {
            // Aller à la page précédente
            page(cu - 1);
        } else {
            // Aller à la page suivante
            page(cu + 1);
        }
    }
});

