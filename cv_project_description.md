# PROJECTS

**Jul 2026 – Present** | **WIGAKI – Unified Game Wiki & Analytics Platform | Personal Project**
**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Node.js, Express.js, PostgreSQL, Prisma ORM, Tailwind CSS v4, Tiptap Editor, RESTful API, JWT, Data Dragon API.

* **Engineered a modern, gaming-tailored user interface** inspired by Mobalytics and OP.GG using Next.js 16 App Router, React 19, and Tailwind CSS v4, implementing Dark Mode, Glassmorphism, dynamic responsive layouts, and Lucide icons without relying on heavy UI frameworks.
* **Aggregated multi-game data sources** by integrating third-party APIs (Riot Data Dragon & CDragon) with Incremental Static Regeneration (ISR) and server-side caching, rendering real-time champion catalogs, items, and skill scaling without hitting API rate limits.
* **Architected a relational database schema** using PostgreSQL and Prisma ORM with cascading updates/deletes to manage complex multi-tier authorization roles (`USER`, `MODERATOR`, `ADMIN`), community articles, revision logs, and build guides.
* **Integrated Rich Text & Custom Build System** using Tiptap WYSIWYG editor and dynamic JSON payload structures, enabling gamers to author comprehensive guides, rune choices, and lane-specific itemization setups (Top, Mid, Jungle, ADC, Support).
* **Implemented secure authentication & access control** built on Express.js and Prisma, leveraging JWT tokens and `bcryptjs` password hashing to secure endpoints for profile management, revision rollbacks, and guide publishing.
* **Optimized application performance & SEO** by building a custom slugification utility for SEO-friendly route URLs, strict TypeScript interfaces across client-server boundaries, and a clean modular architecture.
* **Github Repository:** https://github.com/tquoc00/Game_Wiki
