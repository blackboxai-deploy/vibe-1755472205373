import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Blog Generator',
  description: 'Generate AI-powered blog posts from any website URL with custom images',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 antialiased">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}