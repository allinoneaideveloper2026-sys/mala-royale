# Mala Royale (beta 0.1)

Best sarees, Custom Kuchu Styles, premium boutique. One codebase gives you:
a browser link, an installable app (PWA), and an Android/iOS app (Capacitor).

    npm install
    npm run dev        # open the printed link on a computer or phone
    npm test           # 16 rules tests (order flow, courier charge, map match, roles)
    npm run build      # production build in dist/

Read docs/00_START_HERE.md first. All documents and policies live in docs/ and are saved
into the host's Google Drive by the app during setup (see docs/DRIVE_STRUCTURE.md).

Mobile app:

    npm i @capacitor/core @capacitor/cli @capacitor/android
    npx cap add android && npm run build && npx cap sync && npx cap open android
