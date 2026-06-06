import "./globals.css";
import { MouseProvider } from "./components/MouseProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MouseProvider>
          {children}
        </MouseProvider></body>
    </html >
  );
}
