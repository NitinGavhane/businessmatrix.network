import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BusinessMatrix — Global B2B Directory",
  description: "Connect with verified global businesses. Find manufacturers, suppliers, wholesalers and service providers worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
