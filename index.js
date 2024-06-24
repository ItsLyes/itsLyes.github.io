// index.js
window.onload = async () => {
// Appel de la fonction triangle avec des paramètres spécifiques
triangle("draw", 100, 10, "#e43f5a");
}

function showBox(boxId) {
    // Masquer toutes les boîtes
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => box.style.display = 'none');

    // Afficher la boîte sélectionnée
    const selectedBox = document.getElementById(boxId);
    if (selectedBox) {
        selectedBox.style.display = 'flex';
    }
}

// Afficher par défaut la première boîte
document.addEventListener('DOMContentLoaded', () => {
    showBox('box1');
});

