# Hostinger Deployment (Next.js Static Export)

## 1) Build the static site

Run:

```bash
npm install
npm run export
```

This generates a static site inside the `out/` folder.

## 2) Open your Hostinger hosting panel

1. Sign in to Hostinger hPanel.
2. Open your hosting account.
3. Choose one upload method:
   - File Manager in hPanel
   - FTP client (FileZilla, WinSCP, Cyberduck)

## 3) Upload to the correct directory

Upload the full contents of the local `out/` folder to:

- `public_html`

Important: upload the files inside `out/`, not the `out` folder itself.

## 4) Preserve Apache rewrite behavior

Make sure `.htaccess` exists in the deployed root (`public_html/.htaccess`) with:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

## 5) Verify after upload

1. Open your domain in an incognito window.
2. Test these routes directly:
   - `/`
   - `/calculator`
   - `/compatibility`
   - `/child-matrix`
   - `/year-forecast`
   - `/matrix-comparison`
   - `/advanced-numerology`
   - `/blog`
   - `/blog/destiny-matrix-numerology-guide`
3. Check that `/sitemap.xml` and `/robots.txt` are accessible.

## 6) Optional cache clear

If updates do not appear:

1. Clear browser cache and hard refresh.
2. If Hostinger cache is enabled, purge it from hPanel.
