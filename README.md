# Weather App Node

Une application Node.js permettant d'obtenir des informations météo en temps réel grâce à l'API OpenWeatherMap. Ce projet utilise Express pour gérer les requêtes HTTP et Axios pour interagir avec l'API.

## Fonctionnalités

- Recherche météo par nom de ville.
- Affichage de la température, description et icône associée.
- Gestion des erreurs :  
  - Ville manquante.  
  - Ville introuvable.  
  - API indisponible.  
- Déploiement sur Heroku.

## URL de l'application

[**Lien vers l'application déployée**](https://aqueous-plains-01548-17464c7b2321.herokuapp.com/) 

## Technologies utilisées

- **Node.js** : Environnement d'exécution JavaScript.  
- **Express** : Framework web rapide et minimaliste pour Node.js.  
- **Axios** : Librairie HTTP pour consommer des API.  
- **EJS** : Moteur de template pour le rendu côté serveur.  
- **Heroku** : Plateforme de déploiement cloud.  
- **Jest & Supertest** : Frameworks pour les tests automatisés.

## Structure du projet

```
weather-app-node/
│
├── views/               # Fichiers EJS pour le rendu HTML
├── tests/               # Tests automatisés
├── .env                 # Clé API et autres variables d'environnement
├── .gitignore           # Fichiers à exclure de Git
├── Procfile             # Configuration pour Heroku
├── package.json         # Dépendances et scripts
├── server.js            # Point d'entrée de l'application
└── README.md            # Documentation du projet
```

## Auteur

**Preiswerk Ugo** - [Ton Profil GitHub](https://github.com/dev-ugo).  
