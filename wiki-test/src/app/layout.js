import "./globals.css";
import { MouseProvider } from "./components/MouseProvider";
import { CanvasProvider } from "./components/CanvasProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MouseProvider>
          <CanvasProvider>
            {children}
          </CanvasProvider>
        </MouseProvider></body>
    </html>
  );
}
