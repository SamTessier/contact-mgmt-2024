import React, { useState } from "react";
import { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { SelectedMonthProvider } from "context/selectedMonthContext";
import styles from "../dist/output.css";
import Sidebar from "@/components/ui/sidebar";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SelectedMonthProvider>
          <div className="relative flex">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isOpen ? 'ml-64' : 'ml-0'}`}>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Outlet />
              </div>
            </div>
          </div>
        </SelectedMonthProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
