# Le Monde de Pixel – Mission 1 : Mon poste de travail

Jeu pédagogique en **TypeScript + Vite** pour élèves de 1re secondaire.

## Rubriques
- Matériel et logiciels
- À l'intérieur du PC (schéma interactif)
- Périphériques
- Ports et connecteurs (dessins vectoriels)
- Défi clavier AZERTY belge

Questions à choix unique, choix multiples, identification tactile des composants, schémas de connecteurs, exercices clavier et saisie de caractères. Progression sauvegardée localement dans le navigateur. Mise en page adaptative aux téléphones, tablettes et ordinateurs.

## Lancer localement
```sh
npm install
npm run dev
```

## Publier
Le workflow `.github/workflows/deploy.yml` compile le jeu sur la branche `main`. Dans **Settings → Pages**, définir **GitHub Actions** comme source de publication.

URL attendue après activation : https://stoffelsc.github.io/pixel-mission-1/
