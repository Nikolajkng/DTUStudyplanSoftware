'use client'
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./styles/globals.css";
import { usePathname } from "next/navigation";
import Head from "next/head";

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
    <><Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>DTU Software Technology</title>
      <link rel="icon" type="image/x-icon" href="/assets/icons/favicon-32x32.png" />
      <script src="https://cdn.tailwindcss.com" async />
    </Head><html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Top Navigation Bar */}
          <nav className="bg-red-700">
            <div className="mx-auto max-w-7xl px-6 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center justify-start">
                  <div className="flex shrink-0 items-center">
                    <Image
                      src="/assets/images/DTU_Logo_White.png"
                      alt="DTU Logo"
                      width={35}
                      height={35} />
                  </div>
                  <div className="ml-6">
                    <div className="flex space-x-4">
                      <Link
                        href={entryPath}
                        className={getLinkClass(entryPath)}
                      >
                        <strong>Hovedside</strong>
                      </Link>
                      <Link
                        href={mystudyPath}
                        className={getLinkClass(mystudyPath)}>
                        <strong>Mine Studieforløb</strong>
                      </Link>
                      <Link
                        href={recstudyPath}
                        className={getLinkClass(recstudyPath)}>
                        <strong>Anbefalede Studieforløb</strong>
                      </Link>
                      <Link
                        href={coursesPath}
                        className={getLinkClass(coursesPath)}>
                        <strong>Kurser</strong>
                      </Link>
                      <Link
                        href={contactPath}
                        className={getLinkClass(contactPath)}>
                        <strong>Kontakt</strong>
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
              </nav>
              <p className="mt-8 text-base leading-6 text-center text-white">
                <strong>Sidst opdateret: Apr 2025 <br /> Lavet af: Nikolaj & Frederik</strong>
              </p>
            </div>
          </footer>
        </body>
      </html></>
  );
}
