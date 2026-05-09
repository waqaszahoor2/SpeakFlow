import './globals.css';

export const metadata = {
  title: 'SpeakFlow — AI English Tutor',
  description: 'Practice English with your personal AI tutor. Real-time grammar corrections, voice conversations, and progress tracking.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.png', apple: '/icon.png' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#7C3AED',
};

import Sidebar from './components/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Sidebar />
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  );
}
