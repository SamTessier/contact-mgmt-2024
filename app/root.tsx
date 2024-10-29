import { useState } from "react";
import { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, NavLink, useLocation, Link } from "@remix-run/react";
import { SelectedMonthProvider } from "context/selectedMonthContext";
import styles from "../dist/output.css";
import logo from "@/assets/asp-pal-logo.png";
import { Footer } from "@/components/ui/footer";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => {
  return [
    { title: "ASP PAL" },
    { name: "description", content: "ASP PAL Student and Staff Management System" },
    { 
      tagName: "link",
      rel: "icon", 
      href: logo,
      type: "image/jpeg"
    }
  ];
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

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
          <div className="relative min-h-screen flex flex-col">
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isOpen ? 'ml-64' : 'ml-0'}`}>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1">
                <div className="flex items-center justify-between py-4">
                  <Link to="/">
                    <img 
                      src={logo} 
                      alt="ASP PAL Logo" 
                      className="h-12 w-auto" 
                    />
                  </Link>
                  {!isAuthPage && (
                    <nav className="flex space-x-4">
                      <NavLink to="/students" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}>
                        Students
                      </NavLink>
                      <NavLink to="/staff" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}>
                        Staff
                      </NavLink>
                      <NavLink to="/getpaid" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}>
                        Get Paid
                      </NavLink>
                      <NavLink to="/logout" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white'}`}>
                        Log Out
                      </NavLink>
                    </nav>
                  )}
                </div>
                <Outlet />
              </div>
            </div>
            {!isAuthPage && <Footer />}
          </div>
        </SelectedMonthProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
