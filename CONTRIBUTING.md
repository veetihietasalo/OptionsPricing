# Contributing to Options Pricing Engine

Thanks for your interest in contributing. This is a Black-Scholes options pricer with a React UI styled after the Bloomberg Terminal. It has no Bloomberg data connection.

## 🤝 How to Contribute

### 1. Fork and Clone
Fork the repository to your GitHub account and clone your fork locally (replace `<your-username>` with your GitHub username):
```bash
git clone https://github.com/<your-username>/OptionsPricing.git
cd OptionsPricing
```

### 2. Set Up Development Environment
Install dependencies for both backend and frontend:
```bash
# Backend
bun install

# Frontend
cd client
bun install
```

### 3. Create a Branch
Create a descriptive branch for your feature or fix:
```bash
git checkout -b feature/amazing-new-feature
```

### 4. Make Changes
- Follow the existing code style (TypeScript, React hooks, functional components).
- Ensure all new features are compatible with the Bloomberg Terminal theme.
- Write clean, self-documenting code.

### 5. Test Your Changes
Run the development servers to verify your changes:
```bash
# Terminal 1
bun run src/server.ts

# Terminal 2
cd client
bun run dev
```

### 6. Submit a Pull Request
Push your branch and open a Pull Request against the `main` branch. Please include:
- A clear description of the changes.
- Screenshots of any UI modifications.
- Related issue numbers (if applicable).

## 🎨 Coding Standards

- **Language**: TypeScript for both backend and frontend.
- **Styling**: TailwindCSS with the custom Bloomberg theme configuration.
- **Architecture**: Keep business logic separate from UI components.
- **Commits**: Use conventional commits (e.g., `feat: add volatility surface`, `fix: correct delta calculation`).

## 🧪 Testing

Currently, we rely on manual verification. Automated tests are planned for the next phase. If you add a complex math function, please include a simple test case or verification steps in your PR description.

## 📜 License

By contributing, you agree that your contributions will be licensed under its MIT License.
