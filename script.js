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
            return
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

        /*for (const p1 of points) {
            const near = [];
            const [x1, y1] = p1;
            for (const p2 of points) {
                const [x2, y2] = p2;
                if (p1 == p2 || (x1 - x2) ** 2 + (y1 - y2) ** 2 > height * width / 100) continue;

                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }
        }*/


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
