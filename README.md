# Introduction
Ce projet permet de mettre à jour Pipedrive pour y ajouter la liste des partenaires implémentés chez chaque organisation. 

Le projet est découpé est en 2 microservices et un task runner :

# Organization (NodeJS)
- Récupérer toutes les organisations dans l'API pipedrive
- Mettre à jour une organisation en ajoutant son site web dans un custom field
- Mettre à jour la liste des partenaires dans un custom field

# Website (NodeJS)
Image Docker permettant de simuler un navigateur.
- Chercher le site web d'une organisation en cherchant son nom dans DuckDuckGo
- Aller sur un site web et récupérer toutes les requêtes HTTP sortantes pour y chercher des partenaires

# Init (Golang)
Main.go permet d'appeler les différents microservices parallèlement pour remplir la base Pipedrive 
