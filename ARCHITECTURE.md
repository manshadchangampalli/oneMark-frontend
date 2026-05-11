# Frontend Architecture Guide

> React · TypeScript · Vite · Tailwind CSS · Zustand · React Router

---

## Naming Conventions

### Files

| Type | Casing | Pattern | Example |
|---|---|---|---|
| **React components** | `PascalCase` | `ComponentName.tsx` | `UserCard.tsx`, `DataTable.tsx` |
| **Screens** | `PascalCase` | `<Name>.tsx` | `Home.tsx`, `Settings.tsx` |
| **Hooks** | `camelCase` | `use<Name>.ts` | `useTimer.ts`, `useAuth.ts` |
| **Utilities / Helpers** | `camelCase` | `<name>.ts` | `formatDate.ts`, `validators.ts` |
| **Constants / Config** | `camelCase` | `<name>.ts` | `endpoints.ts`, `routes.ts` |
| **Types / Interfaces** | `camelCase` | `<name>.types.ts` | `user.types.ts`, `api.types.ts` |
| **Stores (Zustand)** | `camelCase` | `use<Name>Store.ts` | `useAuthStore.ts`, `useCartStore.ts` |
| **API modules** | `camelCase` | `<name>Api.ts` | `userApi.ts`, `orderApi.ts` |
| **Styles (CSS/SCSS)** | `camelCase` | `<name>.module.scss` | `card.module.scss` |
| **Tests** | Match source | `<SourceFile>.test.tsx` | `UserCard.test.tsx` |
| **Index / barrel** | lowercase | `index.ts` | `index.ts` |

### Folders

| Rule | Example |
|---|---|
| Always **`kebab-case`** | `user-settings/`, `order-history/` |
| Each screen gets its own folder | `screens/home/`, `screens/settings/` |
| Sub-folders inside each screen | `screens/home/components/`, `screens/home/hooks/` |

### Variables & Functions

| Type | Casing | Example |
|---|---|---|
| Components | `PascalCase` | `UserCard`, `DataGrid` |
| Functions | `camelCase` | `formatDate()`, `calculateTotal()` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL` |
| Types / Interfaces | `PascalCase` | `User`, `ApiResponse`, `OrderItem` |
| Enums | `PascalCase` / members `PascalCase` | `Status.Active`, `Role.Admin` |
| Boolean props/vars | `is` / `has` / `should` prefix | `isLoading`, `hasError`, `isVisible` |
| Event handlers | `on` + `Action` | `onSubmit`, `onClick`, `onClose` |
| Callback props | `on` + `Action` | `onSave`, `onDelete`, `onNavigate` |

---

## Folder Structure

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── .prettierrc
├── .env
├── .env.development
├── ARCHITECTURE.md
│
├── public/
│   ├── favicon.svg
│   └── fonts/
│
└── src/
    ├── main.tsx                  # Entry point — mounts <App />
    ├── App.tsx                   # Root layout, router, providers
    ├── index.css                 # Global styles, Tailwind directives
    ├── vite-env.d.ts
    │
    ├── app/                      # App-level wiring
    │   ├── routes.tsx            # Route definitions
    │   ├── providers.tsx         # QueryClient, theme, etc.
    │   └── layouts/
    │       └── <LayoutName>.tsx  # Shared layout shells
    │
    ├── components/               # SHARED components (used by 2+ pages)
    │   ├── ui/                   # Design system primitives
    │   │   ├── <ComponentName>.tsx
    │   │   ├── ...
    │   │   └── index.ts
    │   └── index.ts
    │
    ├── hooks/                    # SHARED hooks (used by 2+ pages)
    │   ├── use<Name>.ts
    │   └── index.ts
    │
    ├── api/                      # SHARED API layer
    │   ├── client.ts             # Axios instance + interceptors
    │   └── index.ts
    │
    ├── store/                    # SHARED Zustand stores (used by 2+ pages)
    │   ├── use<Name>Store.ts
    │   └── index.ts
    │
    ├── utils/                    # SHARED utilities (pure functions, no React)
    │   ├── <helperName>.ts
    │   ├── cn.ts                 # clsx + tailwind-merge helper
    │   └── index.ts
    │
    ├── types/                    # SHARED TypeScript types
    │   ├── <domain>.types.ts
    │   └── index.ts
    │
    ├── constants/                # SHARED constants
    │   ├── <name>.ts
    │   └── index.ts
    │
    ├── screens/                  # ⭐ Each screen is a self-contained module
    │   │
    │   └── <screen-name>/        # kebab-case folder per screen
    │       ├── <ScreenName>.tsx  # Screen entry component (PascalCase)
    │       ├── components/       # Components used ONLY by this screen
    │       ├── hooks/            # Hooks used ONLY by this screen
    │       ├── api/              # API calls for this screen
    │       ├── store/            # Zustand store for this screen
    │       ├── constants/        # Constants used ONLY by this screen
    │       ├── config/           # Configuration used ONLY by this screen
    │       ├── utils/            # Helpers for this screen
    │       └── index.ts          # Barrel export
    │
    └── assets/                   # Static assets
        ├── images/
        ├── icons/
        └── fonts/
```

---

## Rules

### 1. Screen-Centric Organization

Each screen is a **self-contained module** under `screens/`. A screen owns its own `components/`, `hooks/`, `api/`, `store/`, `constants/`, `config/`, and `utils/`. Only promote to root-level shared folders when **two or more screens** need the same thing.

```
✅  screens/<screen>/hooks/use<Name>.ts        → only this screen needs it
✅  screens/<screen>/store/use<Screen>Store.ts → only this screen needs it
✅  screens/<screen>/api/<screen>Api.ts        → only this screen needs it
✅  hooks/use<Name>.ts                         → multiple screens need it
✅  store/use<NameStore>.ts                    → multiple screens need it
✅  components/ui/<Component>.tsx              → every screen uses it

❌  hooks/use<Name>.ts                         → if only one screen needs it, keep in that screen
❌  store/use<Screen>Store.ts                  → don't hoist screen-specific stores to root
```

### 2. Barrel Exports

Every folder with 2+ exports gets an `index.ts`:

```ts
// screens/<screen-name>/components/index.ts
export { ComponentA } from './ComponentA';
export { ComponentB } from './ComponentB';
export { ComponentC } from './ComponentC';
```

Import via the barrel:

```ts
// ✅ Clean
import { ComponentA, ComponentB } from '@/screens/<screen-name>/components';

// ❌ Deep imports
import { ComponentA } from '@/screens/<screen-name>/components/ComponentA';
```

### 3. Path Aliases

Use `@/` for `src/`:

```ts
// vite.config.ts
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}
```

```ts
// tsconfig.app.json
"paths": { "@/*": ["./src/*"] }
```

### 4. Component File Structure

Every component file follows the same internal order:

```tsx
// 1. Imports
import { useState } from 'react';
import { Card, Button } from '@/components/ui';
import { cn } from '@/utils/cn';

// 2. Types (if small, otherwise separate .types.ts file)
interface MyComponentProps {
  title: string;
  count: number;
}

// 3. Component
export function MyComponent({ title, count }: MyComponentProps) {
  // hooks first
  const [isExpanded, setIsExpanded] = useState(false);

  // derived state
  const displayText = `${title}: ${count}`;

  // handlers
  const handleToggle = () => setIsExpanded((prev) => !prev);

  // render
  return (
    <Card>...</Card>
  );
}
```

### 5. No Default Exports

Always use **named exports**. This ensures consistent naming across the codebase:

```ts
// ✅
export function MyComponent() {}

// ❌
export default function MyComponent() {}
```

**Exception**: Screen components exported for lazy loading:

```ts
export default function SomeScreen() {}
```

### 6. One Component Per File

Each `.tsx` file exports **one** public component. Small helper components used only inside that file are okay as private (unexported).

### 7. Strict TypeScript

- No `any` — use `unknown` or proper types
- All component props get an explicit interface
- API responses are typed via `types/`
- Use discriminated unions for state:

```ts
type ViewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SomeType }
  | { status: 'error'; message: string };
```

### 8. CSS Strategy

- **Tailwind** for all layout and styling
- **`cn()` helper** (clsx + tailwind-merge) for conditional classes
- **CSS modules** (`.module.scss`) only for complex animations
- No inline `style={}` unless dynamic values (e.g., chart colors)

---

## Import Order

Enforced via ESLint. Order top-to-bottom:

```ts
// 1. React / external libraries
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 2. Internal — app-level
import { MainLayout } from '@/app/layouts/MainLayout';

// 3. Internal — screens / components
import { SomeComponent } from '@/screens/<screen-name>/components';
import { Card, Button } from '@/components/ui';

// 4. Internal — hooks, stores, api
import { useAuthStore } from '@/store';
import { userApi } from '@/api';

// 5. Internal — utils, types, constants
import { cn } from '@/utils/cn';
import type { User } from '@/types';
import { ROUTES } from '@/constants';

// 6. Styles (last)
import styles from './component.module.scss';
```

---

## Design Tokens Reference

Use these Tailwind color names across the project:

| Token | Light | Dark | Usage |
|---|---|---|---|
| `paper` | `#FAF7F2` | `#15140F` | Page background |
| `surface` | `#FFFFFF` | `#1C1A14` | Card background |
| `line` | `#EAE5DA` | `#2A2720` | Borders, dividers |
| `ink` | `#1A1815` | `#F2EEE6` | Primary text |
| `ink-muted` | `#6B6760` | `#9C9686` | Secondary text |
| `accent` | `#D4541A` | — | Brand color, CTAs |
| `good` | `#3D7A4E` | — | Success states |
| `warn` | `#C8941E` | — | Warning states |
| `bad` | `#A8341C` | — | Error states |
| `fire` | `#E8580C` | — | Streak / highlight |

Fonts: `Inter` (sans), `Lora` (serif), `JetBrains Mono` (mono).
