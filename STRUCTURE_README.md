# NMD Associates - Website Structure

## Security Features Implemented:

1. **HTTP Security Headers** (.htaccess)
   - CSP, X-Frame-Options, XSS Protection
   - HSTS, Referrer Policy

2. **Security Files**
   - security.txt (RFC 9116)
   - robots.txt
   - sitemap.xml

3. **Error Pages**
   - 403, 404, 500 custom pages

4. **Enhanced Code**
   - Secure CSS with validation styles
   - JavaScript with input sanitization
   - Service Worker for offline access

## Directory Structure:

- `/` - Root with HTML files
- `/assets/` - Static resources
  - `/css/` - Stylesheets
  - `/js/` - JavaScript files
  - `/images/` - Images and icons
- `/includes/` - Reusable HTML components
- `/.well-known/` - Security and verification files

## Maintenance:

1. Update contact info in `includes/footer.html`
2. Update domain in `sitemap.xml` and `robots.txt`
3. Run security tests regularly
4. Keep dependencies updated
