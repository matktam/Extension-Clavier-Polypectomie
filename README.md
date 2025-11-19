# Extension Clavier Polypectomie (WEDA)
Cette extension de navigateur est conçue pour assister les gastro-entérologues utilisant la solution logicielle **WEDA**. Elle fournit une interface de "clavier virtuel" permettant de standardiser et d'accélérer la saisie des comptes rendus de polypectomies.

## 📋 Fonctionnalités

* **Intégration WEDA** : Conçu pour fonctionner directement sur l'interface web de WEDA.
* **Saisie Standardisée** : Permet de générer rapidement des descriptions de polypes (taille, localisation, morphologie, technique de résection) via des boutons prédéfinis.
* **Gain de temps** : Réduit la saisie manuelle et les erreurs de frappe dans les comptes rendus opératoires.

## 🛠 Prérequis

* Un navigateur basé sur Chromium (Google Chrome, Microsoft Edge, Brave, etc.) ou Firefox.
* Un accès à la plateforme WEDA.

## 📥 Installation

L'extension n'étant pas (encore) disponible sur le Chrome Web Store, vous devez l'installer manuellement en "mode développeur".

1.  **Télécharger le code source :**
    * Cliquez sur le bouton vert **Code** en haut de cette page.
    * Sélectionnez **Download ZIP**.
    * Décompressez le fichier ZIP dans un dossier de votre ordinateur (par exemple `Documents/Extension-Polypectomie`).

2.  **Charger l'extension dans le navigateur :**
    * Ouvrez votre navigateur (Chrome/Edge).
    * Allez dans la gestion des extensions :
        * Tapez `chrome://extensions` (ou `edge://extensions`) dans la barre d'adresse.
    * Activez le **Mode développeur** (bouton à bascule généralement situé en haut à droite).
    * Cliquez sur le bouton **Charger l'extension non empaquetée** (ou *Load unpacked*).
    * Sélectionnez le dossier que vous avez décompressé à l'étape 1.

L'extension devrait maintenant apparaître dans votre barre d'outils.

## 🚀 Utilisation

1.  Connectez-vous à votre interface **WEDA**.
2.  Ouvrez un dossier patient et placez votre curseur dans la zone de texte où vous souhaitez insérer le compte rendu.
3.  Ouvrez le clavier de polypectomie (soit via l'icône de l'extension, soit si elle s'intègre directement dans la page).
4.  Cliquez sur les boutons correspondant aux caractéristiques du polype (ex: *Sessile*, *10mm*, *Côlon droit*, *Anse froide*).
5.  Le texte standardisé sera automatiquement inséré dans le champ de saisie.

## 📂 Structure du projet

* `manifest.json` : Fichier de configuration de l'extension (permissions, version).
* `mk_ext_clavier.html` : L'interface visuelle du clavier (les boutons).
* `mk_ext_clavier.js` : La logique qui gère les clics sur les boutons du clavier.
* `mk_ext_content.js` : Le script qui interagit avec la page WEDA pour insérer le texte.
* `mk_ext_background.js` : Script d'arrière-plan pour la gestion des événements de l'extension.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer la liste des termes, l'interface ou la compatibilité :

1.  Forkez ce projet.
2.  Créez une branche pour votre fonctionnalité (`git checkout -b feature/AjoutTerme`).
3.  Committez vos changements (`git commit -m 'Ajout de la classification de Paris'`).
4.  Poussez vers la branche (`git push origin feature/AjoutTerme`).
5.  Ouvrez une Pull Request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
