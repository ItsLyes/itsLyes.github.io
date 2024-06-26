// index.js
window.onload = async () => {
    // Appel de la fonction triangle avec des paramètres spécifiques
    triangle("draw", 100, 10, "#e43f5a");
}

let currentIndex = 0; // Index actuel de la boîte affichée
const boxes = document.querySelectorAll('.box'); // Sélection de toutes les boîtes

function showBox(index) {
    // Masquer toutes les boîtes
    boxes.forEach(box => box.style.display = 'none');

	 // Afficher la boîte sélectionnée avec une transition
    if (index >= 0 && index < boxes.length) {
        const selectedBox = boxes[index];
        selectedBox.style.display = 'flex';
        selectedBox.style.position = 'relative';
    }
}
// Gestion des boutons "Forward" et "Before"
document.querySelector('.navigation button:first-of-type').onclick = () => {
    if (currentIndex > 0) {
        currentIndex--;
        showBox(currentIndex);
    }
};

document.querySelector('.navigation button:last-of-type').onclick = () => {
    if (currentIndex < boxes.length - 1) {
        currentIndex++;
        showBox(currentIndex);
    }
};

// Afficher par défaut la première boîte
document.addEventListener('DOMContentLoaded', () => {
    showBox(currentIndex);
});

