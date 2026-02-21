---
description: Deploy updated Nginx config and reload service
---

## Steps to apply the new Nginx configuration

1. **Rebuild the frontend Docker image** (includes the updated `nginx.conf`).
   ```bash
   # // turbo
   docker-compose up -d --build frontend
   ```

2. **Reload Nginx inside the running container** to apply the new config without stopping the container.
   ```bash
   # // turbo
   docker-compose exec frontend nginx -s reload
   ```

   *If the container does not have `nginx` in the PATH, you can restart the container instead:*
   ```bash
   # // turbo
   docker-compose restart frontend
   ```

3. **Verify the new headers**:
   - Open your browser’s DevTools → Network tab.
   - Reload a static asset (e.g., `logo-j7nQFvIz.png`).
   - Confirm the response includes:
     ```
     Cache-Control: public, max-age=2592000, immutable
     Expires: <date 30 days from now>
     ```

4. **Optional – Clean up old images** (if you want to free space):
   ```bash
   # // turbo
   docker image prune -f
   ```

---

**Note**: All commands are safe to run on your local development environment. They will rebuild the image, restart/reload the Nginx service, and ensure the new caching rules are active.
