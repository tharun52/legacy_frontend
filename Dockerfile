# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copy package.json only — use npm install instead of npm ci because the
# existing package-lock.json was generated with Angular 9 and is incompatible
# with Angular 18. npm install regenerates the dependency tree from package.json.
# Once a fresh lockfile is committed post-migration, switch back to npm ci.
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source and build for production
COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: Runtime (nginx) ───────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove the default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy the Angular build output from the build stage
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Non-root user for security hardening
RUN addgroup -S appgroup \
  && adduser -S appuser -G appgroup \
  && chown -R appuser:appgroup /usr/share/nginx/html \
  && chown -R appuser:appgroup /var/cache/nginx \
  && chown -R appuser:appgroup /var/log/nginx \
  && touch /var/run/nginx.pid \
  && chown appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
