# NEwAGENT-IA

Ce projet fournit une suite d'outils pour un agent IA, permettant d'interagir avec des LLM locaux, le web, le système de fichiers et des services météo.

## 🛠 Outils inclus (`tools.js`)

Le fichier `tools.js` exporte les outils suivants :

- **`lmStudioTool`** : Connecteur pour interagir avec un modèle de langage local via LM Studio.
- **`fetchTool`** : Outil pour récupérer le contenu textuel d'une page web (nettoie le HTML, les scripts et le style).
- **`fileWriteTool`** : Outil pour écrire du contenu dans un fichier local.
- **`weatherTool`** : Outil pour obtenir la météo actuelle d'une ville via l'API WeatherAPI.

## ⚙️ Installation

1. Assurez-vous d'avoir Node.js installé.
2. Installez les dépendances du projet :

```bash
npm install
```

## 🔑 Configuration (.env)

Ce projet utilise des variables d'environnement. Créez un fichier `.env` à la racine du projet et configurez les clés suivantes :

```ini
# Configuration LM Studio (LLM Local)
LM_API_URL="http://localhost:1234/v1/chat/completions"
LM_MODEL="nom-du-modele-charge"

# Configuration Météo (WeatherAPI.com)
WEATHER_API_KEY="votre_cle_api_ici"
```

## 🚀 Utilisation

Importez les outils dans votre script principal :

```javascript
const { lmStudioTool, fetchTool, weatherTool } = require('./tools');
```