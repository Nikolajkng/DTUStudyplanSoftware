'use client'
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


////////////////////////////////////////////////////////////////////////////

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname()

  // Helper function to determine if the current link is active
  const getLinkClass = (href: string) => {
    return pathName === href
      ? "rounded-md bg-red-900 px-3 py-2 text-sm font-medium text-white"
      : "rounded-md px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-700 hover:text-white";
  };

  const entryPath = "/";
  const mystudyPath = "/my-studyplan";
  const recstudyPath = "/recommended-studyplan";
  const coursesPath = "/courses";
  const contactPath = "/contact";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Top Navigation Bar */}
        <nav className="bg-red-700">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-start">
                <div className="flex shrink-0 items-center">
                  <Image
                    src="/assets/images/DTU_Logo_White.png"
                    alt="DTU Logo"
                    width={35}
                    height={35}
                  />
                </div>
                <div className="ml-6">
                  <div className="flex space-x-4">
                    <Link
                      href={entryPath}
                      className={getLinkClass(entryPath)}
                    >
                      Hovedside
                    </Link>
                    <Link
                      href={mystudyPath}
                      className={getLinkClass(mystudyPath)}                  >
                      Mine Studieforløb
                    </Link>
                    <Link
                      href={recstudyPath}
                      className={getLinkClass(recstudyPath)}                  >
                      Anbefalede Studieforløb
                    </Link>
                    <Link
                      href={coursesPath}
                      className={getLinkClass(coursesPath)}                  >
                      Kurser
                    </Link>
                    <Link
                      href={contactPath}
                      className={getLinkClass(contactPath)}              >
                      Kontakt
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-red-700 text-center mt-auto">
          <div className="max-w-screen-xl px-4 py-4 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8 mt-10">
            <nav className="flex flex-wrap justify-center -mx-5 -my-2">
              <div className="px-5 py-2">
                <a href="#" className="text-base leading-6 text-white hover:underline">
                  <strong>Om</strong>
                </a>
              </div>
              <div className="px-5 py-2">
                <a href={contactPath} className="text-base leading-6 text-white hover:underline">
                  <strong>Om</strong>
                </a>
              </div>
            </nav>
            <p className="mt-8 text-base leading-6 text-center text-white">
              <strong>Sidst opdateret: Mar 2025 <br /> Lavet af: Nikolaj & Frederik</strong>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
