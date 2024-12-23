import { Poppins } from "next/font/google";
import "./bg.scss";
import "./globals.css";
import Script from "next/script";

const noto = Poppins({ weight: ["400", "500", "600", "700", "800", "900"], subsets: ["latin-ext"] })

export const metadata = {
  title: "sticla.me - Recicleazǎ-mǎ",
  description: "Venim la tine acasǎ, luǎm sticlele, și le reciclam pentru tine.",
  metadataBase: new URL('https://sticla.me'),
  openGraph: {
    images: '/logo.jpeg',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script type="text/javascript">{`(function(c,l,a,r,i,t,y){
c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "nscyix2oo6");`}</Script>
      </head>
      <body className={noto.className}>{children}</body>
    </html>
  );
}
