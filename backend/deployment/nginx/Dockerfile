FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for uploads
RUN mkdir -p /app/web/uploads

# Set proper permissions
RUN chown -R nginx:nginx /app/web/uploads
