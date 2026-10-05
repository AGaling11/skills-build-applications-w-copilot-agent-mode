# OctoFit Tracker frontend

The React 19 presentation tier is served by Vite on port `5173` and talks to
the Express API on port `8000`.

## API URL configuration

In GitHub Codespaces, define `VITE_CODESPACE_NAME` in
`octofit-tracker/frontend/.env.local` using the Codespace name only:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite exposes this variable to the client through `import.meta.env`. The
frontend builds the API URL as
`https://<VITE_CODESPACE_NAME>-8000.app.github.dev`. Restart the Vite server
after changing `.env.local`.

When `VITE_CODESPACE_NAME` is unset or empty, the frontend safely falls back to
`http://localhost:8000`.
