# Rock Castle — React Showcase Components

This folder contains 3 separate, fully-featured, production-ready React components with complete animations, plus an optional combined wrapper. They are completely self-contained and ready to copy directly into any other React project (Next.js, Vite, CRA, Remix, Astro, etc.).

---

## 📦 Components Overview

| Component | File | Description |
| :--- | :--- | :--- |
| **`ProjectsMatrix`** | [ProjectsMatrix.tsx](file:///c:/Users/sathv/Downloads/rockcastle/src/components/ProjectsMatrix.tsx) | The **Architecture in motion** 10-projects grid with staggered edge-arrival entrance animation, corner-clipped cards, monochrome-to-color zoom on hover, and an interactive floating `VIEW` cursor badge. *(Does not include the previous "We create space experiences" part)* |
| **`WhatWeProduce`** | [WhatWeProduce.tsx](file:///c:/Users/sathv/Downloads/rockcastle/src/components/WhatWeProduce.tsx) | The **What we produce** vocabulary marquee with scroll-reactive horizontal parallax + the continuous capability band loop with pause-on-hover. |
| **`ClientStories`** | [ClientStories.tsx](file:///c:/Users/sathv/Downloads/rockcastle/src/components/ClientStories.tsx) | The **Client stories / What they say.** editorial review ticker with smooth momentum easing, Next/Prev navigation buttons, hover pause, touch swipe / drag, and scroll-velocity boost. |
| **`RockCastleSections`** | [RockCastleSections.tsx](file:///c:/Users/sathv/Downloads/rockcastle/src/components/RockCastleSections.tsx) | All 3 sections seamlessly stacked in sequence. |

---

## 🚀 How to Use in Another Project

### 1. Copy the Files
Copy the `src/components` folder (or just the specific component folder you need):
- `projects-matrix/` (`ProjectsMatrix.tsx`, `projects-matrix.css`)
- `what-we-produce/` (`WhatWeProduce.tsx`, `what-we-produce.css`)
- `client-stories/` (`ClientStories.tsx`, `client-stories.css`)

### 2. Import & Render

```tsx
import React from 'react';
import { 
  ProjectsMatrix, 
  WhatWeProduce, 
  ClientStories 
} from './components';

export default function App() {
  return (
    <main>
      {/* 1. Projects Matrix Section */}
      <ProjectsMatrix />

      {/* 2. What We Produce Section */}
      <WhatWeProduce theme="light" />

      {/* 3. Client Stories Section */}
      <ClientStories theme="light" />
    </main>
  );
}
```

Or import all 3 together:

```tsx
import { RockCastleSections } from './components/RockCastleSections';

export default function Page() {
  return <RockCastleSections />;
}
```

---

## ⚙️ Component Props & Customization

### 1. `ProjectsMatrix` Props
```ts
interface ProjectsMatrixProps {
  projects?: ProjectItem[];          // Custom 10 projects (id, num, category, title, tags, image, href)
  eyebrow?: string;                  // Default: "10 Projects"
  titleMain?: string;                // Default: "Architecture"
  titleSub?: string;                 // Default: "in motion"
  ctaText?: string;                  // Default: "Explore Projects"
  ctaHref?: string;                  // Default: "#connect"
  onCtaClick?: () => void;           // Callback on CTA click
  onProjectClick?: (p: ProjectItem) => void;
  showCustomCursor?: boolean;        // Floating "VIEW" cursor (default: true)
  className?: string;
  style?: React.CSSProperties;
}
```

### 2. `WhatWeProduce` Props
```ts
interface WhatWeProduceProps {
  label?: string;                    // Default: "What we produce"
  words?: string[];                  // Giant marquee words
  capabilities?: string[];           // Lower band ticker disciplines
  theme?: "light" | "dark";          // Default: "light"
  scrollParallaxFactor?: number;     // Parallax shift factor (default: 0.28)
  autoMarqueeSpeed?: number;         // Base drift speed (default: 0.5)
  className?: string;
  style?: React.CSSProperties;
}
```

### 3. `ClientStories` Props
```ts
interface ClientStoriesProps {
  title?: string;                    // Default: "What they say."
  label?: string;                    // Default: "Client stories"
  index?: string;                    // Default: "[ 05 ]"
  testimonials?: TestimonialItem[];  // Reviews (quote, author, role, company, avatar)
  theme?: "light" | "dark";          // Default: "light"
  baseVelocity?: number;             // Ticker speed (default: 0.35)
  enableScrollBoost?: boolean;       // Accelerate on scroll (default: true)
  className?: string;
  style?: React.CSSProperties;
}
```
