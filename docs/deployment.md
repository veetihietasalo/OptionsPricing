# Deployment Guide

Nothing is deployed yet. The client calls `http://localhost:3001` directly (in `App.tsx`, `Heatmap.tsx`, `Signals.tsx` and `Pairs.tsx`), so a hosted frontend needs that URL changed first.

## Cloud Deployment

### AWS (Elastic Beanstalk / ECS)
1. **Frontend**: Build the React app (`bun run build` in `client/`) and deploy the `dist/` folder to an S3 bucket configured for static website hosting + CloudFront.
2. **Backend**: Deploy the Node.js/Bun server to Elastic Beanstalk or ECS. Ensure environment variables are set.

### Vercel (Frontend Only)
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `client`.
3. Vercel will automatically detect Vite and build the project.
4. Configure the API proxy or ensure your backend is deployed elsewhere (e.g., Railway, Render) and update the API URL in the frontend.

### Render / Railway (Full Stack)
1. **Backend**: Create a new Web Service, point to the repo root. Start command: `bun run src/server.ts`.
2. **Frontend**: Create a Static Site, point to `client` directory. Build command: `bun install && bun run build`. Publish directory: `dist`.
