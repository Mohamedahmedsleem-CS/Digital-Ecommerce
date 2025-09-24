import localFont from "next/font/local";
// import { Roboto, Cairo } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import { CartProvider } from "./_context/CartContext";

// Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
// Temporarily disabled Google Fonts due to network access issues
// const roboto = Roboto({
//   subsets: ["latin"],
//   weight: ["700"],
// });

// const cairo = Cairo({
//   subsets: ["arabic", "latin"],
//   weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
//   variable: "--font-cairo",
// });

// Viewport for proper mobile scaling
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};


export const metadata = {
  title: "عطارة المكارم المميزة",
  description: "نقدم لكم أجود أنواع الأعشاب الطبيعية، الزيوت، العسل، والمستحضرات العشبية الأصيلة بخبرة تمتد لأعوام. عطارة المكارم المميزة – وجهتكم للمنتجات الطبيعية والصحة البديلة.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body
        className={[
          // roboto.className, // Temporarily disabled
          geistSans.variable,
          geistMono.variable,
          // cairo.variable, // Temporarily disabled
          // Layout fixes
          "min-h-screen flex flex-col overflow-x-hidden antialiased text-gray-900",
        ].join(" ")}
      >
        <CartProvider>
          <Header />

          {/* صفحة متجاوبة: Container موحد لكل الصفحات */}
          <main className="flex-1">
            <div className="container mx-auto w-full max-w-screen-xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
              {children}
            </div>
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
