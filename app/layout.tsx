import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

export const metadata = { title: "OAH Booking Engine" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Inter,sans-serif] antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
