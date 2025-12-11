# AI_RULES.md

This document outlines the technical stack and specific library usage rules for the GlicoSmart application, intended to guide AI development and ensure consistency.

## 🛠 Tech Stack Overview

The GlicoSmart application is built using a modern web development stack, focusing on performance, user experience, and maintainability.

*   **React 18.2**: The core JavaScript library for building dynamic and interactive user interfaces.
*   **Vite 5.0**: A fast and efficient build tool that provides a rapid development experience.
*   **Tailwind CSS 3.4**: A utility-first CSS framework used for all styling, enabling rapid UI development and consistent design.
*   **Lucide React**: A comprehensive icon library for incorporating scalable vector graphics into components.
*   **Chart.js 4.4 & React Chart.js 2**: Used for creating responsive and interactive data visualizations, particularly for glucose trend analysis.
*   **date-fns**: A lightweight and modular JavaScript date utility library for all date and time manipulation.
*   **Local Storage**: Utilized for client-side data persistence, managing user profiles and glucose readings without a backend.
*   **clsx & tailwind-merge**: Utility libraries for constructing conditional CSS class strings efficiently.
*   **Progressive Web App (PWA)**: The application is designed as a PWA, offering an installable, offline-capable experience.
*   **JavaScript/TypeScript**: While existing files are in JavaScript (`.jsx`), all new components and files should be written in **TypeScript (`.tsx`)** to leverage type safety and modern development practices.

## 📚 Library Usage Rules

To maintain consistency and leverage the strengths of each library, follow these guidelines:

*   **UI Styling**:
    *   **Primary Styling**: Always use **Tailwind CSS** classes for all component styling.
    *   **Component Library**: Leverage **shadcn/ui** components for common UI elements (e.g., buttons, forms, dialogs). If a specific UI element is not available or requires significant customization, create a new custom component using Tailwind CSS.
    *   **Class Utilities**: Use `clsx` for conditional class application and `tailwind-merge` for safely merging Tailwind classes.

*   **Icons**:
    *   Always use icons from **`lucide-react`**.

*   **Data Visualization**:
    *   For all charts and graphs, use **`Chart.js`** integrated with **`react-chartjs-2`**.

*   **Date & Time Management**:
    *   All date parsing, formatting, and manipulation should be handled using **`date-fns`**.

*   **State Management**:
    *   For client-side application state, continue using React's built-in `useState`, `useEffect`, and custom hooks (e.g., `useAppStore`) backed by `localStorage`.

*   **Routing**:
    *   For managing navigation between different application views, **`react-router-dom`** should be used. If not already installed, it should be added as a dependency. The main routing configuration should reside in `src/App.tsx`.

*   **Notifications**:
    *   For displaying transient messages (e.g., success, error, loading), use **`react-hot-toast`**.

*   **Error Handling**:
    *   Use the provided `ErrorBoundary` component to catch and display UI errors gracefully.

*   **File Structure**:
    *   New components should be placed in `src/components/`.
    *   New pages should be placed in `src/pages/`.
    *   New hooks should be placed in `src/hooks/`.
    *   New utility functions should be placed in `src/utils/`.
    *   Directory names MUST be all lower-case. File names may use mixed-case.