This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📱 Android App (Capacitor)

This project has been configured with Capacitor to be wrapped as a native Android APK.

### Prerequisites
- **Android Studio** installed (latest version recommended)
- **JDK 17** (Java Development Kit)
- **Android SDK** (Configured via Android Studio)

### Development & Live Reload
During development, the Android app is configured in `capacitor.config.ts` to live-reload from your Vercel deployment URL.
1. Run `npm run android` to open Android Studio.
2. Hit the "Run" (Play) button in Android Studio to launch the app on an emulator or plugged-in device.

### Generating a Signed Release APK (Production)
Before building for production, you must remove the `server` block from `capacitor.config.ts` so the app loads the bundled static files offline instead of hitting the Vercel URL.
1. Comment out or delete the `server` block in `capacitor.config.ts`.
2. Run the automated build script:
   ```bash
   npm run android:build
   ```
3. This script will:
   - Build the Next.js static export (`npm run build`)
   - Sync the web assets to the Android project (`npx cap sync`)
   - Run Gradle to assemble the Release APK (`./gradlew assembleRelease`)
4. To sign the generated APK (located at `android/app/build/outputs/apk/release/app-release-unsigned.apk`), you can either:
   - Open Android Studio (`npx cap open android`), go to **Build > Generate Signed Bundle / APK** and follow the GUI wizard.
   - Or configure your `build.gradle` with a keystore for automated signing.
