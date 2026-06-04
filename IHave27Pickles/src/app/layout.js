import "./globals.css";
import { MouseProvider } from "./components/MouseProvider";
import { CanvasProvider } from "./components/CanvasProvider";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MouseProvider>
          <div className="crt">
            <CanvasProvider>
              {children}
            </CanvasProvider>
          </div>
        </MouseProvider></body>
    </html>
  );
}
