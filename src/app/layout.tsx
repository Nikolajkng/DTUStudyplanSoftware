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
                    width={48}
                    height={48}
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
      </body>
    </html>
  );
}
