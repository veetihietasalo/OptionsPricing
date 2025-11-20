# Deployment Guide

## Docker Deployment

The easiest way to deploy the Options Pricing Engine is using Docker.

### 1. Build the Image
```bash
docker build -t options-pricing-engine .
```

### 2. Run the Container
```bash
docker run -p 3000:3000 -e PORT=3000 options-pricing-engine
```

## Cloud Deployment

### AWS (Elastic Beanstalk / ECS)
1. **Frontend**: Build the React app (`npm run build` in `client/`) and deploy the `dist/` folder to an S3 bucket configured for static website hosting + CloudFront.
2. **Backend**: Deploy the Node.js/Bun server to Elastic Beanstalk or ECS. Ensure environment variables are set.

### Vercel (Frontend Only)
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `client`.
3. Vercel will automatically detect Vite and build the project.
4. Configure the API proxy or ensure your backend is deployed elsewhere (e.g., Railway, Render) and update the API URL in the frontend.

### Render / Railway (Full Stack)
1. **Backend**: Create a new Web Service, point to the repo root. Start command: `bun run src/server.ts`.
2. **Frontend**: Create a Static Site, point to `client` directory. Build command: `bun install && bun run build`. Publish directory: `dist`.

## Bloomberg App Portal

For deployment to the Bloomberg App Portal, please refer to the [Bloomberg Integration Guide](bloomberg_integration.md).

You will need to:
1. Host the application on a secure HTTPS server.
2. Whitelist the domain in the Bloomberg Developer Portal.
3. Configure the `bloomberg-app.json` manifest.
