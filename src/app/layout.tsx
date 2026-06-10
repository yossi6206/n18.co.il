import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const polin = localFont({
  src: [
    {
      path: "../components/pl/Polin-Hairline.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../components/pl/Polin-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-polin",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "N18 | אתר החדשות של ישראל",
  description: "כל העדכונים, הכתבות, הסקרים והדיווחים בזמן אמת מערוץ N18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${polin.variable} font-sans`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
