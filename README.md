# Joel Holmberg Portfolio - Monorepo

A modern, type-safe portfolio monorepo built with Sanity Studio, TypeScript, and Yarn Workspaces.

## 🏗 Architecture

This monorepo consists of three packages:

- **`@joel-portfolio/studio`** - Sanity Studio CMS for content management
- **`@joel-portfolio/frontend`** - React frontend application (placeholder)  
- **`@joel-portfolio/shared`** - Shared TypeScript types and utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn 4.x (already configured with Plug'n'Play)

### Setup
```bash
# Install all dependencies
yarn install

# Start Sanity Studio
yarn dev

# Studio will be available at: http://localhost:3333
```

## 📦 Workspaces

### Studio (`@joel-portfolio/studio`)
Sanity Studio v4 with TypeScript for content management.

**Features:**
- Complete schema system (About, Artwork, Press)
- Asset management (Images, Video, Audio)
- Automated import scripts
- GraphQL API ready

### Shared Types (`@joel-portfolio/shared`)
TypeScript interfaces and utilities shared between Studio and Frontend.

**Usage:**
```typescript
import type { Artwork, Press } from '@joel-portfolio/shared';
import { GROQ_QUERIES, SANITY_CONFIG } from '@joel-portfolio/shared';
```

### Frontend (`@joel-portfolio/frontend`)
React application placeholder for the portfolio website.

**Setup a frontend:**
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind
```

## 🗄 Sanity Project
### Configuration

- **Project ID:** `zflu9f6c`
- **Dataset:** `production`
- **Studio URL:** http://localhost:3333

## 🛠 Technical Stack

- **Package Manager:** Yarn 4.x with Plug'n'Play
- **CMS:** Sanity Studio v4
- **Language:** TypeScript 5+
- **Architecture:** Yarn Workspaces Monorepo

---

Built with ❤️ using Sanity Studio, TypeScript, and Yarn Workspaces.Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
