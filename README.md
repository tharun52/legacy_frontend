# Blog Frontend — Angular

## Tech Stack
- **Framework**: Angular 9
- **Node Version**: 16 (required — Node 17+ breaks Angular 9)
- **Styling**: SCSS per component + global `styles.scss`
- **HTTP**: Angular `HttpClient` with JWT interceptor
- **Routing**: Angular Router with auth guard

---

## Folder Structure

```
legacy_frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/              # Login page (username + password form)
│   │   │   ├── register/           # Register page
│   │   │   ├── post-list/          # Home page — lists all posts
│   │   │   ├── post-detail/        # Single post view + comments section
│   │   │   └── post-form/          # Create / edit post form
│   │   │
│   │   ├── guards/
│   │   │   └── auth.guard.ts       # Redirects to /login if not authenticated
│   │   │
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # Attaches JWT token to every outgoing request
│   │   │
│   │   ├── app.component.*         # Root component — navbar + router outlet
│   │   └── app.module.ts           # Declares all components, imports, routes, providers
│   │
│   ├── services/
│   │   ├── auth.service.ts         # Login, register, logout, token storage
│   │   └── blog.service.ts         # API calls for posts and comments
│   │
│   ├── environments/
│   │   ├── environment.ts          # Local dev config (API URL = localhost:5000)
│   │   └── environment.prod.ts     # Production config (API URL = backend EC2 IP)
│   │
│   ├── styles.scss                 # Global styles applied across the whole app
│   └── index.html                  # App HTML shell
│
├── nginx.conf                      # Nginx config for serving the built app on EC2
├── blog-frontend.service           # Systemd service file for Ubuntu EC2
└── deploy.sh                       # Deployment script for Ubuntu EC2
```

---

## Running Locally

```bash
# Ensure you are using Node 16
nvm use 16

# Install dependencies
npm install

# Start dev server
ng serve
# App available at http://localhost:4200
```

> If you get an OpenSSL error, prefix the command:
> `NODE_OPTIONS=--openssl-legacy-provider ng serve`

---

## Routes

| Path        | Component       | Auth Required | Description             |
|-------------|-----------------|---------------|-------------------------|
| `/`         | PostListComponent | Yes (guard) | Blog home page          |
| `/login`    | LoginComponent  | No            | Login form              |
| `/register` | RegisterComponent | No          | Registration form       |

---

## Where to Make Changes

### Point to a different backend API
`src/environments/environment.ts` (local dev):
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```
`src/environments/environment.prod.ts` (production build):
```ts
export const environment = {
  production: true,
  apiUrl: 'http://BACKEND_EC2_PUBLIC_IP:5000/api'
};
```
Both `blog.service.ts` and `auth.service.ts` read from `environment.apiUrl` — you only need to change it here.

### Add a new page / route
1. Create a new component folder under `src/app/components/`
2. Add the component to `declarations` in `app.module.ts`
3. Add a route entry to the `routes` array in `app.module.ts`
4. Add `canActivate: [AuthGuard]` to the route if login is required

### Add a new API call
`src/services/blog.service.ts` — add a new method using `this.http.get/post/put/delete`.
The JWT token is automatically attached by the interceptor — no extra work needed.

### Change the navbar
`src/app/app.component.html` and `src/app/app.component.scss` — the navbar is rendered at the root level and is only visible when the user is logged in.

### Change global styles (fonts, colors, body background)
`src/styles.scss` — styles here apply across every component in the app.

### Change component-level styles
Each component has its own `.scss` file alongside its `.ts` and `.html` files. Styles in these files are scoped to that component only.

### Change JWT token storage
`src/services/auth.service.ts` — token is stored in `localStorage` under the key `token`. Change the storage mechanism here if needed (e.g. sessionStorage).

### Change the auth guard behaviour
`src/app/guards/auth.guard.ts` — currently redirects to `/login` if no token found. Update the redirect path or logic here.

---

## Building for Production

```bash
ng build --prod
# Output goes to dist/frontend/
```

The `--prod` flag automatically swaps `environment.ts` with `environment.prod.ts`, so the built app will point to the backend EC2 IP.

---

## Deploying to Ubuntu EC2

1. Edit `deploy.sh` and set `BACKEND_EC2_IP` to your backend instance's public IP
2. Copy the folder to the EC2 instance
3. Run:
```bash
bash deploy.sh
```
The script installs Node 16, builds the Angular app, configures Nginx to serve it, and registers a systemd service that starts on boot.
