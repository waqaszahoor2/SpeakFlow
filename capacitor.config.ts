import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.englishlearner',
  appName: 'English Learner AI',
  webDir: 'out',
  // REMOVE the 'server' block below for production builds so it loads local static files!
  // ONLY keep this for development to live-reload from your Vercel deployment.
  server: {
    url: 'https://speakflow-web.vercel.app', // Update with your actual Vercel deployment URL
    cleartext: true
  }
};

export default config;
