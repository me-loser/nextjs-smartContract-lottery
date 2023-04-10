"use client";
import "./globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/dist/output.css" rel="stylesheet" />
      </head>
      <body>
        <MoralisProvider initializeOnMount={false}>
          <NotificationProvider>{children}</NotificationProvider>
        </MoralisProvider>
      </body>
    </html>
  );
}
