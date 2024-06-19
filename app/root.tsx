import { useState } from "react";
import { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, NavLink } from "@remix-run/react";
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
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <SelectedMonthProvider>
          <div className="relative flex h-full">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isOpen ? 'ml-64' : 'ml-0'}`}>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1">
                <nav className="flex space-x-4 py-4">
                  <NavLink to="/students" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}>
                    Students
                  </NavLink>
                  <NavLink to="/staff" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}>
                    Staff
                  </NavLink>
                  <NavLink to="/accounting" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}>
                    Accounting
                  </NavLink>
                </nav>
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
