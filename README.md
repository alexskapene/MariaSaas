# 🏥 MariaSaaS - Open Source Pharmacy Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**MariaSaaS** est une solution de gestion de pharmacie de pointe, conçue pour être **moderne**, **sécurisée** et **Offline-First**. 

L'objectif de ce projet est de démocratiser l'accès à des outils de gestion pharmaceutique professionnels pour les officines indépendantes, particulièrement dans les zones à connectivité limitée, tout en respectant les standards internationaux (GxP).

## ✨ Vision & Impact
Dans de nombreuses régions, les pharmacies luttent avec des systèmes obsolètes ou coûteux. MariaSaaS offre :
- 🔒 **Souveraineté des données** : Stockage local via SQLite/Prisma.
- ⚡ **Performance native** : Application desktop via Electron + Vite.
- 💰 **Flexibilité financière** : Gestion multi-devises (USD/CDF) avec taux de change dynamique.
- 🤖 **Intelligence** : Monitoring des stocks critiques et aide à la décision.

---

## 🏗 Architecture Technique

Le projet utilise une architecture **Vertical Slice** stricte pour une scalabilité maximale.

| Couche | Technologie | Rôle |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TailwindCSS | Interface utilisateur réactive et typée. |
| **State** | Redux Toolkit | Source unique de vérité (Auth, Stock, Session). |
| **Backend** | Node.js (Main Process) | Logique métier, sécurité et accès disque. |
| **Persistance**| Prisma + SQLite | ORM moderne pour une base de données locale robuste. |
| **Validation** | Zod | Schémas de données partagés (zéro duplication). |

---

## 🚀 Démarrage Rapide

### Pré-requis
- **Node.js :** v20+ ou v22+ (LTS recommandé).
- **OS :** Windows, macOS ou Linux.

### Installation

1.  **Cloner le projet :**
    ```bash
    git clone https://github.com/votre-username/MariaSaaS.git
    cd MariaSaaS
    npm install
    ```

2.  **Initialiser la base de données locale :**
    ```bash
    # Créez un fichier .env à la racine : DATABASE_URL="file:./dev.db"
    npx prisma db push
    ```

3.  **Lancer en mode développement :**
    ```bash
    npm run dev
    ```

---

## 🤝 Contribuer

Nous adorons les contributions ! Que ce soit pour corriger un bug, ajouter une fonctionnalité ou améliorer la documentation.

### Workflow de développement
1. Consultez les **Issues** pour trouver une tâche.
2. Suivez le **Guide du Développeur** dans le wiki pour comprendre le pattern IPC/Redux.
3. Créez une branche (`feature/incroyable-option`).
4. Soumettez une Pull Request (PR).

---

## 🛠 Roadmap & Prochaines étapes
- [ ] Module Point de Vente (POS) complet.
- [ ] Impression de tickets de caisse (Thermique/ESC-POS).
- [ ] Exportation des rapports en PDF et Excel.
- [ ] Synchronisation optionnelle avec un Cloud (MCP Architecture).

---

## 📄 Licence
Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, de le modifier et de le distribuer.

---
*Développé pour l'accès aux soins de santé.*