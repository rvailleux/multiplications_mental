# Architecture du Projet - Mental Math Game

## Vue d'ensemble

Jeu de mathématiques mentales développé avec React, TypeScript et Vite. L'application propose des défis de multiplication chronométrés avec suivi des scores et statistiques de performance.

## Stack Technique

### Technologies Principales

#### Frontend Framework
- **React 19.0.0** - Bibliothèque UI avec composants fonctionnels et hooks
- **TypeScript 5.7.2** - Superset typé de JavaScript pour la sécurité des types
- **React Router DOM 7.5.0** - Gestion du routage et navigation

#### Build & Development Tools
- **Vite 6.2.0** - Outil de build moderne et serveur de développement
- **ESLint 9.21.0** - Linting et analyse de code statique
- **Prettier 3.7.4** - Formatage automatique du code
- **TypeDoc 0.28.15** - Génération automatique de documentation

#### Testing Framework
- **Vitest 4.0.16** - Framework de test moderne et rapide
- **React Testing Library 16.3.1** - Utilitaires de test pour composants React
- **Happy-DOM 20.0.11** - Environnement DOM léger pour les tests
- **@testing-library/jest-dom** - Matchers supplémentaires pour les tests

#### Development Automation
- **Husky 9.1.7** - Hooks Git pour l'automatisation
- **lint-staged 16.2.7** - Linting des fichiers stagés uniquement

## Architecture Logicielle

### Pattern Architectural

L'application suit une architecture **Component-Based** avec séparation des responsabilités :

```
┌──────────────────┐   ┌─────────────────┐   ┌──────────────────────┐
│      Pages       │   │   Components    │   │       Hooks          │
│                  │   │                 │   │                      │
│ - PlayerSelect   │◄──┤ - ProgressBar   │◄──┤ - useTimer           │
│ - HomePage       │   │ - MultiQuestion │   │ - usePlayerMgmt      │
│ - PlayPage       │   │                 │   │ - useBackgroundMusic │
└──────────────────┘   └─────────────────┘   └──────────────────────┘
         │                      │                       │
         ▼                      ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      React Router + State                           │
└─────────────────────────────────────────────────────────────────────┘
         │                      │                       │
         ▼                      ▼                       ▼
┌──────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   localStorage   │   │   Browser APIs  │   │   CSS-in-JS     │
│                  │   │                 │   │                 │
│ - Players        │   │ - Timer APIs    │   │ - Inline Styles │
│ - CurrentPlayer  │   │ - DOM Events    │   │ - Pixel Art     │
│ - Scores         │   │ - Keyboard      │   │ - Animations    │
│ - Game Results   │   │ - Audio APIs    │   │ - Responsive    │
└──────────────────┘   └─────────────────┘   └─────────────────┘
```

### Structure des Dossiers

```
src/
├── components/          # Composants réutilisables
│   ├── ProgressBar.tsx              # Barre de progression visuelle
│   ├── MultiplicationQuestion.tsx   # Interface de question
│   └── *.test.tsx                   # Tests des composants
├── pages/              # Composants de niveau route
│   ├── PlayerSelectPage.tsx         # Sélection du joueur
│   ├── HomePage.tsx                 # Page d'accueil avec historique
│   ├── PlayPage.tsx                 # Page de jeu principale
│   └── *.test.tsx                   # Tests des pages
├── hooks/              # Hooks personnalisés
│   ├── useTimer.ts                  # Gestion du minuteur
│   ├── usePlayerManagement.ts       # Gestion des joueurs
│   ├── useBackgroundMusic.ts        # Contrôle de la musique
│   └── *.test.ts                    # Tests des hooks
├── types/              # Types et utilitaires TypeScript
│   └── player.ts                    # Types Player + utils localStorage
├── test/               # Configuration des tests
│   └── setup.ts                     # Setup global pour les tests
├── App.tsx             # Composant racine avec routage
└── main.tsx            # Point d'entrée de l'application
```

### Flux de Données

#### 1. Navigation Flow
```
PlayerSelectPage → [Select Player] → HomePage → [Start Game] → PlayPage
      ↑                                  ↑                         ↓
      │                                  │                  [Timer Ends]
      │                                  │                         ↓
      │                                  └───────── [Save Score] ──┘
      │                                             localStorage
      │
      └──── [No Player Selected] ← HomePage/PlayPage redirect
```

#### 2. Game State Management
```
PlayPage
├── useTimer(60) → secondsLeft, reset
├── useState(score) → score, setScore
└── useState(results) → GameResult[]
    ├── onCorrectAnswer → increment score, record result
    └── onBadAnswer → record result only
```

#### 3. Player Management Flow
```
PlayerSelectPage
├── usePlayerManagement()
│   ├── getPlayers() → Player[]
│   ├── getCurrentPlayer() → Player | null
│   └── selectPlayer(index) → setCurrentPlayerId(id)
│
└── Keyboard Navigation
    ├── ArrowUp → selectedIndex--
    ├── ArrowDown → selectedIndex++
    └── Enter → selectPlayer() → navigate('/home')

type Player = {
  id: string      // "jules", "achille"
  name: string    // "Jules", "Achille"
}
```

#### 4. Data Persistence
```
Game Session → GameResult[] → ScoreEntry → localStorage['scores']

Player Selection → Player.id → localStorage['currentPlayer']

Default Players → Player[] → localStorage['players']

type GameResult = {
  question: string    // "3 x 7"
  correct: boolean    // true/false
}

type ScoreEntry = {
  score: number       // Final score
  results: GameResult[]  // All attempts
}
```

## Patterns de Conception

### 1. Component Composition Pattern
- **Composants purs** : ProgressBar, MultiplicationQuestion
- **Composants containers** : HomePage, PlayPage
- **Props drilling** minimal grâce aux callbacks

### 2. Custom Hooks Pattern
- **useTimer** : Encapsulation de la logique de minuteur
- **usePlayerManagement** : Gestion de l'état des joueurs et localStorage
- **useBackgroundMusic** : Contrôle de la musique de fond
- **Séparation des préoccupations** : logique métier vs présentation
- **Réutilisabilité** : hooks indépendants du contexte UI

### 3. Event-Driven Pattern
- **Callbacks props** : `onCorrectAnswer`, `onBadAnswer`
- **Découpling** : composants enfants notifient les parents
- **Unidirectional data flow** : données descendantes, événements montants

### 4. State Lifting Pattern
- **État partagé** : score et résultats gérés dans PlayPage
- **Single source of truth** : état centralisé au niveau approprié
- **Props interface** : communication typée entre composants

### 5. Keyboard Navigation Pattern
- **Event listeners** : addEventListener/removeEventListener dans useEffect
- **Cleanup pattern** : return cleanup function pour éviter les fuites mémoire
- **Bounded navigation** : Math.max/Math.min pour limiter l'index
- **Multi-key support** : ArrowUp, ArrowDown, Enter

## Gestion des États

### État Local (useState)
```typescript
// PlayPage.tsx
const [score, setScore] = useState(0)              // Score actuel
const [results, setResults] = useState<GameResult[]>([])  // Historique des tentatives
const [combo, setCombo] = useState(0)              // Combo de réponses correctes
const [lives, setLives] = useState(3)              // Vies restantes

// PlayerSelectPage.tsx
const [selectedIndex, setSelectedIndex] = useState(0)  // Index du joueur sélectionné

// MultiplicationQuestion.tsx
const [factorA, setFactorA] = useState(1)          // Premier facteur
const [factorB, setFactorB] = useState(1)          // Deuxième facteur
const [userAnswer, setUserAnswer] = useState('')   // Réponse utilisateur
```

### État Persistant (localStorage)
```typescript
// Structure de données
interface Player {
  id: string
  name: string
}

interface ScoreEntry {
  score: number
  results: GameResult[]
}

// Storage pattern - Players
const players: Player[] = JSON.parse(localStorage.getItem('players') || '[]')
localStorage.setItem('players', JSON.stringify(players))

// Storage pattern - Current Player
const currentPlayerId = localStorage.getItem('currentPlayer')
localStorage.setItem('currentPlayer', 'jules')

// Storage pattern - Scores
const scores: ScoreEntry[] = JSON.parse(localStorage.getItem('scores') || '[]')
localStorage.setItem('scores', JSON.stringify([...scores, newScore]))
```

### État Dérivé
```typescript
// Calculs basés sur l'état existant
const progress = ((totalTime - secondsLeft) / totalTime) * 100
const visibleScores = showAll ? scores : scores.slice(0, 5)
const isBlinking = progress >= 80
```

## Stratégies de Performance

### 1. Optimisations React
- **Composants fonctionnels** : Performance supérieure aux classes
- **État minimal** : Seules les données nécessaires en état
- **Éviter les re-renders** : Props stables, pas d'objets inline

### 2. Timer Optimization
- **setInterval cleanup** : Prevention des fuites mémoire
- **Functional updates** : `setSecondsLeft(prev => prev - 1)`
- **Dependency array** : `useEffect([], [])` pour setup unique

### 3. Bundle Optimization
- **Tree shaking** : Vite élimine le code non utilisé
- **Code splitting** : Routes séparées automatiquement
- **Dynamic imports** : Chargement lazy si nécessaire

## Sécurité & Bonnes Pratiques

### Type Safety
- **Interfaces exportées** : Props documentées et typées
- **Strict TypeScript** : Configuration stricte activée
- **No implicit any** : Types explicites requis

### Code Quality
- **JSDoc documentation** : Tous les composants documentés
- **ESLint rules** : Règles strictes pour React/TypeScript
- **Pre-commit hooks** : Validation automatique avant commit

### Error Handling
- **Input validation** : Vérification des types d'entrée
- **Default values** : Fallbacks pour localStorage
- **Error boundaries** : À implémenter pour la production

## Scalabilité & Extensibilité

### Architecture Modulaire
```
Future Structure:
src/
├── features/           # Feature-based organization
│   ├── game/              # Game logic
│   ├── stats/             # Statistics tracking  
│   └── auth/              # User authentication
├── shared/             # Shared utilities
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom hooks
│   └── utils/             # Helper functions
└── config/             # Configuration files
```

### Points d'Extension
1. **Niveaux de difficulté** : Paramétrer les plages de nombres
2. **Autres opérations** : Addition, soustraction, division
3. **Multijoueur** : WebSocket pour compétition temps réel
4. **PWA** : Installation et fonctionnement hors ligne
5. **Analytics** : Tracking des performances utilisateur

### Migration Paths
- **State Management** : Migration vers Zustand/Redux si complexité croissante
- **Styling** : Migration vers Tailwind CSS ou styled-components
- **Backend** : API REST/GraphQL pour persistance server-side
- **Mobile** : React Native pour applications mobiles

## Tests & Qualité

### Stratégie de Test
```
Test Pyramid:
┌─────────────┐  E2E Tests (Playwright/Cypress)
│     E2E     │  - User workflows complets
└─────────────┘
┌─────────────┐  Integration Tests (React Testing Library)  
│ Integration │  - Interactions entre composants
└─────────────┘
┌─────────────┐  Unit Tests (Vitest)
│    Unit     │  - Logique métier, hooks, utilitaires
└─────────────┘
```

### Coverage Targets
- **Functions** : 90%+
- **Statements** : 85%+
- **Branches** : 80%+
- **Lines** : 85%+

## Déploiement & DevOps

### Build Process
```bash
npm run build    # TypeScript compilation + Vite bundle
npm run preview  # Preview production build locally
npm run docs     # Generate API documentation
```

### Environment Configuration
```
Development:  npm run dev       # Hot reload, source maps
Testing:      npm run test      # Watch mode, coverage
Production:   npm run build     # Optimized bundle
```

### CI/CD Pipeline (Future)
```yaml
Pipeline Stages:
1. Install Dependencies
2. Type Checking (tsc --noEmit)  
3. Linting (eslint)
4. Testing (vitest)
5. Build (vite build)
6. Deploy (static hosting)
```

## Monitoring & Analytics

### Performance Metrics
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Bundle size** : < 500KB
- **Test coverage** : > 80%

### User Metrics (Future)
- **Game completion rate**
- **Average score progression**
- **Session duration**
- **Error rates**

---

Cette architecture privilégie la simplicité, la maintenabilité et la scalabilité pour assurer l'évolution future du projet.