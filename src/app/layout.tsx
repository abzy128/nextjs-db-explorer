import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employees",
  description: "Employee management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 25 }}>
        {children}
      </body>
    </html>
  );
}
