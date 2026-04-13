import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Script from "next/script";

export const metadata = {
  title: {
    default: "Open Air Homes — Furnished Rentals in Southern California",
    template: "%s | Open Air Homes",
  },
  description: "Book furnished homes for short stays and monthly rentals across Los Angeles and Palm Springs. Save 10-15% vs Airbnb. Professionally managed by Open Air Homes.",
  keywords: ["furnished rentals", "monthly rentals Los Angeles", "short term rentals Palm Springs", "Venice Beach monthly rental", "direct booking vacation rental"],
  openGraph: {
    type: "website",
    siteName: "Open Air Homes",
    title: "Open Air Homes — Furnished Rentals in Southern California",
    description: "Book furnished homes for short stays and monthly rentals. Save 10-15% vs Airbnb.",
    url: "https://oah-booking-engine.vercel.app",
    images: [{ url: "/images/homes/Washington_38.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Air Homes — Furnished Rentals",
    description: "Furnished homes across Southern California. Save 10-15% vs Airbnb.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NDRH45HM');
            `,
          }}
        />

        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NDRH45HM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
