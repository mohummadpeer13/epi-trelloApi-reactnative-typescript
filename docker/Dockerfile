# Utiliser Node.js 22 comme base
FROM node:22

# Définir le répertoire de travail
WORKDIR /my-app

# Copier package.json et package-lock.json pour optimiser le cache Docker
COPY ./my-app/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer les ports nécessaires pour Expo
EXPOSE 8081 19000 19001

# Démarrer Expo en mode développement
CMD ["/bin/sh"]
