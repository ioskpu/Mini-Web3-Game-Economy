import "./globals.css";
import { Web3Provider } from "./providers";

export const metadata = {
  title: "Mini Web3 Game Economy",
  description: "Web3 demo project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
