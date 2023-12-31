import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Ahmed Naoum | Full-stack devloper",
    template: "%s | Ahmed Naoum",
  },
  description: "a full-stack developer",
  openGraph: {
    title: "Ahmed Naoum",
    description: "a full-stack developer",
    url: "",
    siteName: "Ahmed Naoum | Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Ahmed Naoum",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = process.env.NEXT_PUBLIC_BEAM_TOKEN;
  if (!token) {
    return null;
  }
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token={token}
          async
        />
      </head>
      <body
        className={`bg-black ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        {children}
      </body>
    </html>
  );
}
