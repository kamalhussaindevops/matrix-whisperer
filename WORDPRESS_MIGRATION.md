# Matrix Whisperer Pro -> WordPress Conversion

This repository now includes a WordPress-ready conversion that preserves your existing React design and calculator logic.

## What was added

- WordPress plugin: `wordpress/wp-content/plugins/matrix-whisperer-pro/`
  - Provides shortcode: `[matrix_whisperer_app]`
  - Loads the Vite-built React app assets
  - Forces `HashRouter` mode in WordPress for route compatibility
  - Creates a `Destiny Matrix Calculator` page on activation

- WordPress theme: `wordpress/wp-content/themes/matrix-whisperer-theme/`
  - Clean shell theme for content pages and blog
  - `front-page.php` renders the React app shortcode
  - Regular pages/posts remain editable in WP editor

- WordPress Vite build target
  - Entry: `src/wordpress-main.tsx`
  - Config: `vite.wordpress.config.ts`
  - Output: `wordpress/wp-content/plugins/matrix-whisperer-pro/assets`

## Build steps

1. Install dependencies

```bash
npm install
```

2. Build WordPress app bundle

```bash
npm run build:wp
```

3. Optional: package plugin + theme zip

```bash
npm run wp:zip
```

This creates `wordpress/matrix-whisperer-wordpress.zip`.

## Install in WordPress

1. Copy plugin folder to your WordPress install:

- `wp-content/plugins/matrix-whisperer-pro`

2. Copy theme folder:

- `wp-content/themes/matrix-whisperer-theme`

3. In WP Admin:

- Activate plugin: **Matrix Whisperer Pro**
- Activate theme: **Matrix Whisperer Theme**
- Set homepage to a static page (the auto-created `Destiny Matrix Calculator` page or any page with `[matrix_whisperer_app]`)

## Editing in WordPress

- The full calculator/design/functionality is served by the React app (same core code).
- All standard WP content (pages, posts, blog content) is editable from WP admin.
- To place the app on any page, add shortcode:

```text
[matrix_whisperer_app]
```

## Notes

- React routing uses hash mode in WordPress (for example `/#/calculator`) to avoid rewrite conflicts.
- Rebuild (`npm run build:wp`) whenever React code/CSS changes.
