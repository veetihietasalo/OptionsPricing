# Deployment Guide

Nothing is deployed yet. The client calls `http://localhost:3001` by default (`client/src/api.ts`). A hosted frontend sets `VITE_API_URL` to the backend's URL at build time.

## Cloud Deployment

### AWS (Elastic Beanstalk / ECS)
1. **Frontend**: Build the React app (`bun run build` in `client/`) and deploy the `dist/` folder to an S3 bucket configured for static website hosting + CloudFront.
2. **Backend**: Deploy the Node.js/Bun server to Elastic Beanstalk or ECS. Ensure environment variables are set.

### Vercel (Frontend Only)
1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `client`.
3. Vercel will automatically detect Vite and build the project.
4. Deploy the backend elsewhere (e.g., Railway, Render) and set `VITE_API_URL` to its URL in the Vercel project.

### Render / Railway (Full Stack)
1. **Backend**: Create a new Web Service, point to the repo root. Start command: `bun run src/server.ts`.
2. **Frontend**: Create a Static Site, point to `client` directory. Build command: `bun install && bun run build`. Publish directory: `dist`. Set `VITE_API_URL` to the backend's URL.
