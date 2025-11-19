// clavier.js

// Fonction pour envoyer le texte à la page parente
function sendTextToParent(text) {
  window.parent.postMessage({ type: "insertText", text: text }, "*");
}

const keyboard = document.querySelector(".keyboard");

// Empêche les clics sur les boutons de faire perdre le focus à la page principale
keyboard.addEventListener("mousedown", (event) => {
  if (event.target.tagName === "BUTTON") {
    event.preventDefault();
  }
});

// Gère le clic sur n'importe quel bouton du clavier
keyboard.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    // On récupère le texte à insérer.
    // Priorité à l'attribut "data-text", sinon on prend le texte visible du bouton.
    let text = event.target.dataset.text || event.target.textContent.trim();

    // On gère les cas spéciaux comme "Entrée" ou "espace"
    if (text.toLowerCase() === 'entrée') {
      text = '\n'; // Transforme "Entrée" en un vrai retour à la ligne
    } else if (text.toLowerCase() === 'espace') {
      text = ' '; // Transforme "espace" en un vrai espace
    }
    
    // On envoie le texte uniquement s'il n'est pas vide
    if (text) {
      sendTextToParent(text);
    }
  }
});