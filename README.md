# MegaCloudFix

A browser extension that redirects all requests from `megacloud.blog` to `megacloud.tv`.

## Purpose

Some anime streaming sites reference megacloud.blog as their video host, which may be unavailable or blocked. This extension transparently rewrites those requests to megacloud.tv, both at the network level and inside the page itself.

## Files

- `manifest.json` - Extension manifest (Manifest V2, Firefox-compatible)
- `background.js` - Intercepts requests at the network level via webRequest API
- `content.js` - Patches fetch and XMLHttpRequest inside the page at document_start
- `rules.json` - Declarative redirect rules (used by Chrome)

## Browser compatibility

### Chrome / Chromium-based browsers

1. Go to `chrome://extensions/`
2. Enable Developer mode (top right toggle)
3. Click "Load unpacked"
4. Select the `megacloudfix` directory

### Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file inside the `megacloudfix` directory

Note: Firefox temporary add-ons are removed on browser restart. For permanent installation, the extension would need to be signed via Mozilla.

## How it works

Two layers of interception run simultaneously:

- `background.js` uses the `webRequest` API to intercept and redirect any network request to `megacloud.blog` before the browser connects
- `content.js` patches `window.fetch` and `XMLHttpRequest.prototype.open` directly inside the page at `document_start`, catching requests that originate from iframes or player scripts before the network layer sees them

No data is collected or transmitted.

## Firefox version

A Firefox-specific version of this extension is available at [RAELIE1/MegaCloudFixFireFox](https://github.com/RAELIE1/MegaCloudFixFireFox).
