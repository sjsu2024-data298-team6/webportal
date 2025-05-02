import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <Link
                  href="/"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent transition-colors hover:from-blue-700 hover:to-indigo-700"
                >
                  Obstacle Detection for Drone Flight Path
                </Link>
                <div className="flex gap-6">
                  <Link
                    href="/model"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Train Model
                  </Link>
                  <Link
                    href="/dataset"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Upload Dataset
                  </Link>
                  <Link
                    href="/inference"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Inference
                  </Link>
                  <Link
                    href="/results"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                  >
                    Results
                  </Link>
                </div>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <Main />
          </main>
          <footer className="border-t py-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                {" < "}
                <span className="">SJSU Fall 2024</span>
                {" | "}
                <span className="">MSDA Capstone Project</span>
                {" | "}
                <a className="hover:underline" target="_blank">
                  Shrey Agarwal
                </a>
                {" | "}
                <a
                  className="hover:underline"
                  href="https://github.com/ibrahimmkhalid"
                  target="_blank"
                >
                  Ibrahim Khalid
                </a>
                {" | "}
                <a className="hover:underline" target="_blank">
                  Sung Won Lee
                </a>
                {" | "}
                <a className="hover:underline" target="_blank">
                  Justin Wang
                </a>
                {" > "}
              </div>
            </div>
          </footer>
        </div>
        <NextScript />
      </body>
    </Html>
  );
}
