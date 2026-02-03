(function() {
  // Sécurité supplémentaire : si jamais le script est injecté dans une iframe par erreur, on arrête tout.
  if (window !== window.top) return;

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

      // 1. Cible prioritaire : l'iframe de l'éditeur de texte spécifique
      const editorFrame = document.getElementById('CE_ContentPlaceHolder1_EditorCourrier_ID_Frame');
      
      // On vérifie si c'est bien cet éditeur qui a le focus ou si on doit forcer l'insertion dedans
      // Note: Parfois on veut écrire dedans même si le focus n'y est pas strictement (ex: focus perdu en cliquant sur le clavier)
      if (editorFrame && editorFrame.contentDocument) {
        // Optionnel : vérifier si l'élément actif est DANS cette iframe ou si c'est l'iframe elle-même
        // Mais dans ton cas, on force souvent l'écriture dans le courrier principal.
        // Si tu veux écrire là où est le curseur uniquement, la logique ci-dessous (Solution de secours) est plus précise.
        
        // Pour l'instant, je garde ta logique prioritaire qui force le focus sur l'éditeur principal
        // si aucune autre zone précise n'est détectée.
        // 
        try {
            editorFrame.contentWindow.focus();
            editorFrame.contentDocument.execCommand('insertText', false, textToInsertWithSpace);
            return; // Succès, on arrête.
        } catch (e) {
            console.log("Erreur insertion éditeur principal, tentative fallback...");
        }
      }
        
// 2. Solution de secours : Élément actif générique
      const activeElement = document.activeElement;
      
      if (activeElement) {
        // CAS A : Zone de texte simple (Input / Textarea) sur la page principale
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

        } 
        // CAS B : Contenu éditable directement sur la page principale (div contenteditable)
        else if (activeElement.isContentEditable) {
          document.execCommand('insertText', false, textToInsertWithSpace);
        }
        // CAS C : L'élément actif est une IFRAME générique (autre que l'éditeur principal identifié plus haut)
        else if (activeElement.tagName === 'IFRAME') {
            try {
                // On essaie d'accéder au document interne de l'iframe active
                if (activeElement.contentDocument && activeElement.contentDocument.body.isContentEditable) {
                    activeElement.contentDocument.execCommand('insertText', false, textToInsertWithSpace);
                } else {
                    // Si le body n'est pas editable, peut-être y a-t-il un élément actif dedans ?
                    // C'est rare mais possible.
                    console.warn("Impossible d'écrire dans cette iframe");
                }
            } catch (e) {
                console.error("Erreur d'accès à l'iframe active (Cross-origin ?)", e);
            }
        }
      }
    }
  });
})();
