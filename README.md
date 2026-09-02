# Fidus - Trust-Based Service Matching Framework

## Overview

Fidus is a **Trust-Based Service Matching Framework** built as a final-year project. This repository contains the **frontend application**, developed with modern web technologies to provide an intuitive and responsive user interface for the service matching platform.

## 🎯 Project Goals

Fidus aims to revolutionize how services are discovered and matched by incorporating trust-based mechanisms. The framework enables users to find and connect with services based on reputation, reliability, and community feedback.

## 🛠️ Technology Stack

### Frontend Technologies
- **React 19.2.6** - UI framework for building interactive interfaces
- **TypeScript 6.0** - Type-safe JavaScript development (98.4% of codebase)
- **Vite 8.0** - Fast build tool and dev server
- **Tailwind CSS 4.3** - Utility-first CSS framework
- **React Router 7.18** - Client-side routing
- **React Query 5.102** - Data fetching and caching
- **Axios 1.20** - HTTP client for API requests
- **Lucide React 1.38** - Icon library
- **React Hot Toast 2.6** - Toast notifications

### Development Tools
- **ESLint 10.3** - Code quality and linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📋 Features

- **Trust-Based Matching** - Advanced algorithms for matching services based on trust scores
- **Responsive UI** - Mobile-friendly interface built with Tailwind CSS
- **Type-Safe Development** - Full TypeScript support for robust code
- **Modern Routing** - Single Page Application (SPA) with React Router
- **State Management** - Efficient data fetching with React Query
- **Real-time Notifications** - Toast-based user feedback system

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abdul-Samod/Fidus.git
   cd Fidus
   ```

2. **Install dependencies:**
   ```bash
   cd fidus
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default).

### Build

Build the application for production:
```bash
npm run build
```

This command:
- Compiles TypeScript (`tsc -b`)
- Bundles with Vite (`vite build`)
- Outputs optimized files to the `dist/` directory

### Linting

Check code quality:
```bash
npm run lint
```

### Preview

Preview the production build locally:
```bash
npm run preview
```

## 📂 Project Structure

```
Fidus/
├── fidus/                 # Frontend application directory
│   ├── src/              # Source code
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services and utilities
│   │   ├── types/        # TypeScript type definitions
│   │   ├── styles/       # Global styles
│   │   └── App.tsx       # Root component
│   ├── package.json      # Project dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   ├── vite.config.ts    # Vite configuration
│   └── eslint.config.js  # ESLint configuration
└── README.md             # Project documentation
```

## 🔗 API Integration

The application communicates with the backend via HTTP requests using Axios. API endpoints are managed through service modules in the `src/services/` directory.

## 🧪 Code Quality

- **TypeScript** ensures type safety across the application
- **ESLint** maintains consistent code style and catches potential errors
- Run `npm run lint` to verify code quality before commits

## 📝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request with a clear description of changes

## 📄 License

This project is part of a final-year academic project. Please refer to the LICENSE file for more information.

## 👤 Author

**Abdul-Samod**
- GitHub: [@Abdul-Samod](https://github.com/Abdul-Samod)

## 📧 Contact & Support

For questions or support regarding this project, please open an issue on the GitHub repository.

## 🙏 Acknowledgments

- Built as a final-year project
- Inspired by modern trust and reputation systems
- Thanks to the open-source community for excellent tools and libraries

---

**Note:** This is the frontend repository of the Fidus project. For the backend API documentation and infrastructure setup, please refer to the main project repository.
