import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "BusinessMatrix.Network — Global B2B Directory",
  description: "Connect with verified global businesses. Find manufacturers, suppliers, wholesalers and service providers worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
