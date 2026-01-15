FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create log directory
RUN mkdir -p /var/log/nginx

# Set proper permissions
RUN chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /var/log/nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/nginx-health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
