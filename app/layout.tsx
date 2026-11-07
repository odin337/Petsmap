import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Национальный клуб породы «Честный знак»",
  description:
    "Интерактивная карта с карточками питомцев и специалистов Национального клуба породы «Честный знак».",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
