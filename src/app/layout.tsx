import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Historical Bar",
    template: "%s | Historical Bar",
  },
  description:
    "Un bar tranquilo donde encontrarte con personajes de la historia.",
  icons: { icon: "/assets/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
