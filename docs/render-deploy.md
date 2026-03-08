# Render Deploy Notes

If web is served via HTTPS, do not let frontend call `http://localhost:4000`.

Set `NEXT_PUBLIC_API_URL` in Render Web Service environment variables to your API HTTPS URL, for example:

```bash
NEXT_PUBLIC_API_URL=https://auto-game-api.onrender.com
```

If web and API are under the same host/domain with a reverse proxy, you can leave it unset and frontend will use same-origin.
