(function() {
  // Crée le bouton de bascule pour afficher/cacher le clavier
  const toggleBtn = document.createElement('div');
  toggleBtn.textContent = '  💩  ';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '20%';
  toggleBtn.style.right = '0';
  toggleBtn.style.transform = 'translateY(-50%)';
  toggleBtn.style.background = '#007bff';
  toggleBtn.style.color = 'white';
  toggleBtn.style.padding = '10px 15px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.borderTopLeftRadius = '8px';
  toggleBtn.style.borderBottomLeftRadius = '8px';
  toggleBtn.style.zIndex = '1000000';
  toggleBtn.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
  toggleBtn.style.fontSize = '14px';
  document.body.appendChild(toggleBtn);

  // Crée l’iframe qui contiendra le clavier
  const keyboardIframe = document.createElement('iframe');
  keyboardIframe.src = chrome.runtime.getURL('mk_ext_clavier.html');
  keyboardIframe.style.position = 'fixed';
  keyboardIframe.style.top = '0';
  keyboardIframe.style.right = '-43%'; // Initialement caché
  keyboardIframe.style.width = '43%';
  keyboardIframe.style.height = '100vh';
  keyboardIframe.style.zIndex = '999999';
  keyboardIframe.style.border = 'none';
  keyboardIframe.style.transition = 'right 0.4s ease';
  keyboardIframe.style.boxShadow = '-2px 0 8px rgba(0,0,0,0.1)';
  document.body.appendChild(keyboardIframe);

  let open = false;

  // Gère le clic sur le bouton de bascule
  toggleBtn.addEventListener('click', () => {
    open = !open;
    keyboardIframe.style.right = open ? '0' : '-50%';
    toggleBtn.textContent = open ? '❌ Fermer' : '  💩  ';
  });

  // Écoute les messages venant de l'iframe du clavier
  window.addEventListener('message', (event) => {
    // Vérification de sécurité pour s'assurer que le message vient de notre extension
    if (event.source !== keyboardIframe.contentWindow) {
      return;
    }

    if (event.data.type === 'insertText' && event.data.text) {
      const textToInsertWithSpace = event.data.text === '\n' ? '\n' : event.data.text + ' ';

      // Cible prioritaire : l'iframe de l'éditeur de texte spécifique
      const editorFrame = document.getElementById('CE_ContentPlaceHolder1_EditorCourrier_ID_Frame');
      
      if (editorFrame && editorFrame.contentDocument) {
        // Si l'iframe de l'éditeur est trouvée
        const editorDoc = editorFrame.contentDocument;
        
        // On donne le focus à la fenêtre de l'iframe pour que la commande fonctionne
        editorFrame.contentWindow.focus();
        
        // On utilise 'execCommand' pour insérer le texte à la position du curseur.
        // C'est la méthode standard pour les éditeurs de texte riches (WYSIWYG).
        editorDoc.execCommand('insertText', false, textToInsertWithSpace);
        
      } else {
        // Solution de secours : si l'iframe n'est pas trouvée, on revient au comportement précédent
        const activeElement = document.activeElement;
        
        if (activeElement) {
          // Cas d'une zone de texte simple (TEXTAREA ou INPUT)
          if (activeElement.tagName === 'TEXTAREA' || 
             (activeElement.tagName === 'INPUT' && /^(text|search|url|tel|password)$/.test(activeElement.type))) {
            
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const currentText = activeElement.value;
            
            activeElement.value = currentText.substring(0, start) + textToInsertWithSpace + currentText.substring(end);
            
            const newCursorPosition = start + textToInsertWithSpace.length;
            activeElement.selectionStart = newCursorPosition;
            activeElement.selectionEnd = newCursorPosition;
    
            activeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

          } else if (activeElement.isContentEditable) {
            // Cas d'un autre élément éditable sur la page principale
            document.execCommand('insertText', false, textToInsertWithSpace);
          }
        }
      }
    }
  });
})();

