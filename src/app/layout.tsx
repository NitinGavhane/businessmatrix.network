import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "BusinessMatrix.Network — Global B2B Directory",
  description: "Connect with verified global businesses. Find manufacturers, suppliers, wholesalers and service providers worldwide.",
  icons: { icon: "/businessmatrix-logo-crop.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning><Providers>{children}</Providers></body>
    </html>
  );
}
