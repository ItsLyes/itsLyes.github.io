// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'backgroundCanvas';
    document.body.appendChild(canvas);

    const colors = ['#FF6347', '#00FFFF', '#FFFF00']; // Couleurs pour les triangles
    const numTriangles = 100; // Nombre de triangles
    const triangleDuration = 10; // Durée de vie des triangles en secondes

    triangle('backgroundCanvas', numTriangles, triangleDuration, colors);

    function triangle(id, amount, duration, colors) {
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
            for (let [x, y, sx, sy, live, color] of points) {
                live -= delta;
                if (live <= 0) continue;

                x += sx * (Math.random() - 0.01) * 2;
                y += sy * (Math.random() - 0.01) * 2;

                if (x < 0 || x >= width || y < 0 || y >= height) continue;

                newPoints.push([x, y, sx, sy, live, color]);
            }

            if (newPoints.length < amount && last - respawn > 100) {
                const x = Math.random() * width;
                const y = Math.random() * height;

                const sx = (Math.random() - 0.5) * 0.5;
                const sy = (Math.random() - 0.5) * 0.5;

                const color = colors[Math.floor(Math.random() * colors.length)];

                newPoints.push([x, y, sx, sy, duration, color]);

                respawn = last;
            }
            points = newPoints;

            context.clearRect(0, 0, width, height);

            for (const [x1, y1, sx, sy, live, color] of points) {
                context.globalAlpha = Math.max(0, live / duration);
                context.strokeStyle = color;

                const radius = 10 * (live / duration);
                context.beginPath();
                context.moveTo(x1 + radius, y1);
                context.lineTo(x1, y1 + radius);
                context.lineTo(x1 - radius, y1);
                context.lineTo(x1, y1 - radius);
                context.closePath();
                context.stroke();
            }

            window.requestAnimationFrame(draw);
        }
    }
});

