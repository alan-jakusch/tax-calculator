# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tax calculator frontend built with React 19, TypeScript, Vite 8, Tailwind CSS 4, and TanStack React Query.

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check with `tsc -b` then build with Vite
- `npm run lint` — run ESLint
- `npm run preview` — preview production build

## Architecture

Uses a Feature-Sliced Design-inspired structure with path aliases:

- `@/app/*` — app shell, root component, providers
- `@/features/*` — feature modules (business logic, UI per feature)
- `@/shared/*` — shared utilities and UI components (`@/shared/ui`)

Entry: `src/main.tsx` wraps `<App />` in `QueryClientProvider` and `StrictMode`.

## Key Technical Details

- **React Compiler** enabled via `@rolldown/plugin-babel` with `reactCompilerPreset()`
- **Path alias**: `@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- **Form handling**: react-hook-form + zod (via `@hookform/resolvers`)
- **Strict TypeScript**: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` are enforced
