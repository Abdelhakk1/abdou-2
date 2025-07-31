import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Soundous Bake Shop - Where Your Sweetest Dreams Come to Life',
  description: 'Professional cake making, workshops, and online courses. Custom cakes for all occasions with expert decorating techniques.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover',
  themeColor: '#FFE4E9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Soundous Bake Shop'
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-touch-fullscreen': 'yes',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="theme-color" content="#FFE4E9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Soundous Bake Shop" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap" as="style" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Function to ping the keep-alive endpoint
            async function pingKeepAlive() {
              try {
                await fetch('/api/keep-alive');
              } catch (error) {
                console.error('Keep-alive error:', error);
              }
            }

            // Ping once per day if the site is visited
            if (!sessionStorage.getItem('lastPing') || 
                Date.now() - parseInt(sessionStorage.getItem('lastPing')) > 86400000) {
              pingKeepAlive();
              sessionStorage.setItem('lastPing', Date.now().toString());
            }
          `
        }} />
      </head>
      <body className="font-sans">
        <Navigation />
        <main className="pt-16 md:pt-20">{children}</main>
        <Footer />
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}