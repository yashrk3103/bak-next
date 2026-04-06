import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { RegionProvider } from "@/components/layout/RegionContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Zirwa Qurbani Service",
  description:
    "Outsource Your Qurbani with Complete Shariah Compliance & Full Transparency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <noscript>
          <img
            alt="Facebook Pixel"
            height={1}
            width={1}
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1418855873316929&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1418855873316929');
            fbq('track', 'PageView');
          `}
        </Script>
        <RegionProvider>
          <AppShell>{children}</AppShell>
        </RegionProvider>
      </body>
    </html>
  );
}
