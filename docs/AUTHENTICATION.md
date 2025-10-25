# Système d'Authentification Geosynthesis

## Vue d'ensemble

Le système d'authentification de Geosynthesis permet aux joueurs de créer des comptes, de se connecter et de sauvegarder leur progression dans le cloud. Cela évite la perte de données qui pourrait survenir avec les sauvegardes uniquement locales (localStorage).

## Architecture

### Base de données (SQLite)

**Fichier**: `src/lib/database.ts`

Deux tables principales :

1. **users** - Informations utilisateur
   - `id` (INTEGER PRIMARY KEY)
   - `username` (TEXT UNIQUE)
   - `email` (TEXT UNIQUE)
   - `password_hash` (TEXT)
   - `created_at` (TEXT)
   - `last_login` (TEXT)

2. **game_saves** - Sauvegardes de jeu
   - `id` (INTEGER PRIMARY KEY)
   - `user_id` (INTEGER FOREIGN KEY)
   - `save_name` (TEXT)
   - `game_state` (TEXT JSON)
   - `created_at` (TEXT)
   - `updated_at` (TEXT)

### Authentification

**Fichier**: `src/lib/auth.ts`

Fonctionnalités :
- `registerUser(username, email, password)` - Inscription avec validation
- `loginUser(username, password)` - Connexion avec vérification bcrypt
- `verifyToken(token)` - Validation JWT
- `getUserById(userId)` - Récupération des données utilisateur

Sécurité :
- Hachage de mot de passe avec bcrypt (10 salt rounds)
- Tokens JWT avec expiration de 7 jours
- Validation des entrées (username ≥3, email valide, password ≥6)

### API Routes

**Fichiers**: 
- `src/app/api/auth/register/route.ts` - Endpoint d'inscription (POST)
- `src/app/api/auth/login/route.ts` - Endpoint de connexion (POST)
- `src/app/api/game/save/route.ts` - Endpoints de sauvegarde/chargement (POST/GET)

Headers requis pour les endpoints protégés :
```typescript
Authorization: Bearer <jwt_token>
```

### Interface Utilisateur

**Fichiers**:
- `src/components/AuthModal.tsx` - Modal de connexion/inscription
- `src/styles/auth.css` - Styles pour l'authentification

Fonctionnalités :
- Formulaires de connexion et d'inscription
- Validation côté client
- Messages d'erreur en français
- Option "Mode invité" pour jouer sans compte

## Flux d'utilisation

### 1. Premier lancement
```
Utilisateur → AuthModal s'affiche
  ├─→ Créer un compte → Inscription → Token JWT stocké → Jeu chargé
  ├─→ Se connecter → Login → Token JWT stocké → Jeu chargé depuis cloud
  └─→ Mode invité → Jeu chargé depuis localStorage (⚠️ avertissement)
```

### 2. Sauvegarde automatique
```
Tour traité → 
  ├─ Authentifié → POST /api/game/save (cloud)
  └─ Mode invité → localStorage (local)
```

### 3. Sauvegarde manuelle
```
Bouton "Sauvegarder" →
  ├─ Authentifié → ☁️ Sauvegarder (cloud)
  └─ Mode invité → 💾 Sauvegarder (local)
```

### 4. Déconnexion
```
Bouton "Déconnexion" → 
  Confirmation → 
  Sauvegarde locale → 
  Suppression token → 
  Retour AuthModal
```

## Configuration

### Variables d'environnement

**Fichier**: `.env.local`

```env
JWT_SECRET=geosynthesis_secret_key_change_in_production_2024
```

⚠️ **IMPORTANT** : Changez cette valeur en production avec une chaîne aléatoire forte.

### Installation

Dépendances ajoutées :
```json
{
  "dependencies": {
    "better-sqlite3": "^9.2.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

Installer avec :
```bash
npm install
```

## Sécurité

### Protection des données

1. **Mots de passe** : Jamais stockés en clair, toujours hachés avec bcrypt
2. **Base de données** : Fichier `geosynthesis.db` exclu de Git (.gitignore)
3. **Tokens JWT** : Expiration automatique après 7 jours
4. **Validation** : Tous les inputs utilisateur sont validés côté serveur

### Limitations actuelles

- ❌ Pas de récupération de mot de passe (à implémenter)
- ❌ Pas de limitation de tentatives de connexion (rate limiting)
- ❌ Pas de vérification d'email
- ✅ Mode invité pour tester sans créer de compte

## API Reference

### POST /api/auth/register

Inscription d'un nouvel utilisateur.

**Request Body**:
```json
{
  "username": "joueur123",
  "email": "joueur@example.com",
  "password": "motdepasse123"
}
```

**Response 201**:
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": { "id": 1, "username": "joueur123", "email": "joueur@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/auth/login

Connexion utilisateur existant.

**Request Body**:
```json
{
  "username": "joueur123",
  "password": "motdepasse123"
}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": { "id": 1, "username": "joueur123", "email": "joueur@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /api/game/save

Sauvegarder l'état du jeu (nécessite authentification).

**Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "saveName": "joueur123 - Auto-save",
  "gameState": { "turn": 42, "year": 2034, ... }
}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Partie sauvegardée avec succès"
}
```

### GET /api/game/save

Charger l'état du jeu (nécessite authentification).

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response 200**:
```json
{
  "success": true,
  "gameState": { "turn": 42, "year": 2034, ... },
  "saveName": "joueur123 - Auto-save",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Développement futur

### Fonctionnalités prioritaires

1. **Récupération de mot de passe** via email
2. **Gestion de profil** (changement email, mot de passe)
3. **Sauvegardes multiples** (slots de sauvegarde nommés)
4. **Rate limiting** pour prévenir les attaques par force brute
5. **Vérification d'email** pour confirmer les comptes
6. **Sessions persistantes** avec refresh tokens

### Améliorations de sécurité

1. HTTPS obligatoire en production
2. CSP (Content Security Policy) headers
3. CORS configuration stricte
4. Audit logging des tentatives de connexion
5. 2FA (authentification à deux facteurs)

## Dépannage

### Erreur "Module not found: better-sqlite3"

Solution : 
```bash
npm install
```

### Base de données verrouillée

Solution : Fermer tous les processus Node.js et relancer le serveur.

### Token expiré

Solution : L'utilisateur doit se reconnecter. Le token est valide 7 jours.

### Échec de sauvegarde cloud

Solution : Le système basculera automatiquement vers localStorage en fallback.

## Licence

Partie du projet Geosynthesis - Voir LICENSE pour plus de détails.
