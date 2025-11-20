# Options Pricing Engine - Bloomberg Terminal Edition

> **Professional options analytics platform designed for Bloomberg Terminal integration**

[![Bloomberg Ready](https://img.shields.io/badge/Bloomberg-Terminal%20Ready-FF6600?style=for-the-badge&logo=bloomberg)](https://www.bloomberg.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

## 🎯 Overview

Enterprise-grade options pricing platform with Black-Scholes analytics, Greeks calculation, and advanced features designed for Bloomberg Terminal deployment.

**Key Features:**
- ✅ Real-time Black-Scholes pricing
- ✅ Full Greeks calculation (Delta, Gamma, Theta, Vega, Rho)
- ✅ Interactive price surface heatmap
- ✅ Bloomberg Terminal UI theme
- ✅ Professional terminal aesthetics

## 🚀 Quick Start

### Prerequisites
- **Bun** (Node.js runtime) - [Install Bun](https://bun.sh)
- Bloomberg Terminal access (for production deployment)
- Bloomberg API (BLPAPI) for live data (optional)

### Local Development

```bash
# Clone the repository
cd OptionsPricing

# Install backend dependencies
bun install

# Install frontend dependencies
cd client
bun install

# Start backend server (Terminal 1)
cd ..
bun run src/server.ts

# Start frontend dev server (Terminal 2)
cd client
bun run dev
```

**Access the app:** `http://localhost:5173`

## 📊 Bloomberg Terminal Integration

### App Portal Deployment

1. **Register** at [developer.bloomberg.com](https://developer.bloomberg.com)
2. **Configure** `bloomberg-app.json` with your details
3. **Deploy** backend to production (AWS/GCP/Azure)
4. **Submit** to Bloomberg App Portal
5. **Launch** via `APPS OPTPRICING <GO>`

### Production Architecture

```
Bloomberg Terminal
    ↓ (APPS OPTPRICING <GO>)
Bloomberg App Portal
    ↓ (serves)
Your Frontend (hosted)
    ↓ (API calls)
Your Backend Server
    ↓ (optional)
Bloomberg B-PIPE (BLPAPI)
```

## 💻 Tech Stack

**Backend:**
- Bun + TypeScript
- Express.js REST API
- Black-Scholes pricing engine

**Frontend:**
- React + Vite
- TailwindCSS (Bloomberg theme)
- Real-time WebSocket (planned)

**Deployment:**
- Docker containerization
- AWS/GCP/Azure compatible
- Bloomberg App Portal ready

## 🎨 Bloomberg Terminal Theme

Authentic Bloomberg Terminal aesthetics:
- **Colors**: Bloomberg orange (#FF6600) / Black (#0A0A0A)
- **Fonts**: Monaco, Consolas (monospace)
- **Layout**: Terminal-inspired panels and data displays
- **UX**: Professional trader workflows

## 📡 API Endpoints

### Calculate Option Price
```bash
POST /api/options/price
Content-Type: application/json

{
  "spot": 100,
  "strike": 100,
  "rate": 0.05,
  "volatility": 0.25,
  "time": 1.0,
  "type": "call"
}
```

### Generate Heatmap
```bash
POST /api/options/heatmap
Content-Type: application/json

{
  "spot": 100,
  "strikes": [90, 95, 100, 105, 110],
  "expirations": [0.25, 0.5, 1.0],
  "rate": 0.05,
  "volatility": 0.25,
  "type": "call"
}
```

## 🔐 Enterprise Features

**Ready for Bloomberg:**
- [ ] Bloomberg SSO authentication
- [ ] BLPAPI market data integration
- [ ] Audit logging & compliance
- [ ] Multi-user support
- [ ] Real-time data subscriptions

**Coming Soon:**
- ML-based recommendation signals
- Statistical arbitrage (pairs trading)
- Implied volatility surfaces
- Risk analytics dashboard

## 📈 Use Cases

**For Quant Analysts:**
- Rapid options pricing scenarios
- Greeks sensitivity analysis
- Volatility surface visualization

**For Options Traders:**
- Real-time pricing updates
- Trade idea generation
- Risk exposure monitoring

**For Portfolio Managers:**
- Hedging analytics
- Position Greeks aggregation
- Scenario analysis

## 🛠️ Development Roadmap

**Phase 1: Core Platform** ✅
- Black-Scholes implementation
- Bloomberg UI theme
- Interactive heatmaps

**Phase 2: Bloomberg Integration** (In Progress)
- BLPAPI data feeds
- App Portal deployment
- SSO authentication

**Phase 3: Advanced Analytics** (Planned)
- ML recommendation engine
- Statistical arbitrage
- Live market data

## 📄 Documentation

- [Bloomberg Integration Guide](docs/bloomberg_integration.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

This is a professional portfolio project. Contributions welcome:
- Bloomberg Terminal testing
- Feature suggestions
- Bug reports
- UI/UX improvements

## 📧 Contact

**For Bloomberg Terminal deployment support:**
- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

## ⚖️ License

MIT License - See [LICENSE](LICENSE) for details

---

**Built for Bloomberg Terminal** | **Production-Ready Architecture** | **Enterprise-Grade Analytics**
