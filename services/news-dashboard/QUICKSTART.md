# Quick Start Guide

Get the Barami News Dashboard up and running in minutes.

## Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for containerized deployment)

## Option 1: Local Development

### Step 1: Install Dependencies

```bash
cd /home/mare/Barami/services/news-dashboard
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 3: Configure API Proxy (Optional)

If your backend API is not running on `http://localhost:8000`, edit `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend:port',  // Change this
      changeOrigin: true,
    },
  },
}
```

## Option 2: Docker Deployment

### Step 1: Build Docker Image

```bash
docker build -t barami-news-dashboard .
```

### Step 2: Run Container

```bash
docker run -p 3001:80 barami-news-dashboard
```

The app will be available at: **http://localhost:3001**

## Option 3: Docker Compose (Recommended)

### Step 1: Copy Example Compose File

```bash
cp docker-compose.example.yml docker-compose.yml
```

### Step 2: Start Services

```bash
docker-compose up -d
```

### Step 3: Check Status

```bash
docker-compose ps
docker-compose logs -f dashboard
```

The app will be available at: **http://localhost:3001**

## Verify Installation

### Health Check

```bash
curl http://localhost:3001/health
# Should return: healthy
```

### API Proxy Test

```bash
curl http://localhost:3001/api/news/stats
# Should return JSON stats (if backend is running)
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Docker
docker build -t barami-news-dashboard .
docker run -p 3001:80 barami-news-dashboard
docker ps            # List running containers
docker logs <id>     # View container logs
docker stop <id>     # Stop container

# Docker Compose
docker-compose up -d              # Start in background
docker-compose down               # Stop and remove
docker-compose logs -f dashboard  # Follow logs
docker-compose restart dashboard  # Restart service
```

## Troubleshooting

### Port Already in Use

Change the port mapping:

```bash
# Local dev
# Edit vite.config.ts: server.port

# Docker
docker run -p 8080:80 barami-news-dashboard

# Docker Compose
# Edit docker-compose.yml: ports section
```

### API Not Connecting

1. Check backend is running:
   ```bash
   curl http://localhost:8000/api/news/stats
   ```

2. Check proxy configuration:
   - Development: `vite.config.ts`
   - Production: `nginx.conf`

3. Check Docker network:
   ```bash
   docker network ls
   docker network inspect barami-network
   ```

### Build Errors

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues

Make sure your backend API allows:
- Origin: `http://localhost:3000` (dev) or your production domain
- Methods: GET, POST, PUT, DELETE
- Headers: Content-Type, Authorization

## Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit as needed:

```env
VITE_API_BASE_URL=/api
```

## Next Steps

1. **Customize Branding**: Edit colors in `tailwind.config.js`
2. **Add Features**: Check `PROJECT_STRUCTURE.md` for component details
3. **Deploy to Production**: See deployment section in `README.md`
4. **Configure Backend**: Ensure API endpoints match expected format
5. **Set Up Monitoring**: Add logging and error tracking

## Production Deployment

### Build Optimized Bundle

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy with Nginx

Copy contents of `dist/` to your web server:

```bash
scp -r dist/* user@server:/var/www/dashboard/
```

Use the provided `nginx.conf` as a template.

### Deploy to Cloud

#### Dockerfile is ready for:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Kubernetes
- Any Docker-compatible platform

## Support

For issues or questions:
1. Check `README.md` for detailed documentation
2. Review `PROJECT_STRUCTURE.md` for architecture details
3. Consult API documentation for backend integration

## Quick Reference

| Task | Command |
|------|---------|
| Install | `npm install` |
| Dev Server | `npm run dev` |
| Build | `npm run build` |
| Docker Build | `docker build -t barami-news-dashboard .` |
| Docker Run | `docker run -p 3001:80 barami-news-dashboard` |
| Compose Up | `docker-compose up -d` |
| Compose Down | `docker-compose down` |
| View Logs | `docker-compose logs -f` |
| Health Check | `curl localhost:3001/health` |

## Default URLs

- **Development**: http://localhost:3000
- **Production (Docker)**: http://localhost:3001
- **API Proxy**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

---

Happy coding! 🚀
