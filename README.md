# Tax Calculator Frontend

Frontend application for calculating Canadian federal marginal income tax based on tax brackets returned by the backend API.

## Project Description

This app allows users to:

- Enter annual income
- Select a tax year (2019 to 2022)
- Fetch tax brackets from the backend
- Calculate and display:
  - Total tax
  - Bracket-by-bracket breakdown
  - Effective tax rate

The UI also handles loading states, API errors, and common edge cases (such as zero income).

## Architecture (FSD Lite)

The project follows a lightweight Feature-Sliced Design structure:

- `src/app`: Application bootstrap and top-level composition
- `src/features/tax-calculator`: Tax calculator feature modules (API, model, hooks, and UI)
- `src/shared`: Reusable UI components and shared utilities

## Libraries and Tooling

Main technologies used in this frontend:

- React 19
- TypeScript
- Vite
- React Hook Form
- Zod
- TanStack Query
- Tailwind CSS
- Vitest
- Testing Library

## How to Run

### Prerequisites

- Node.js `v24`
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root with:

```bash
VITE_API_BASE_URL=http://localhost:5001
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run tests

```bash
npm run test
npm run test:run
npm run test:coverage
```

## Backend Requirement

This frontend expects the backend API base URL to be set in `.env` using:

`VITE_API_BASE_URL`

For local development, use:

`http://localhost:5001`

Used endpoint pattern:

`GET /tax-calculator/tax-year/{year}`
