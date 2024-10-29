import { MetaFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useLocation, Link } from "@remix-run/react";
import { useSelectedMonth } from "context/selectedMonthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/utils";
import logo from "@/assets/asp-pal-logo.png";


export const meta: MetaFunction = () => {
  return [
    { title: "ASP PAL - Student Management" },
    { name: "description", content: "ASP PAL Student and Staff Management System" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  try {
    const user = await requireUser(args); 
    if (user) {
      return redirect("/home");
    } else {
      return redirect("/login");
    }
  } catch (error) {
    console.error("User not authenticated:", error);
    return redirect("/login");
  }
};

export default function Index() {
  const { selectedMonth, setSelectedMonth } = useSelectedMonth();
  const months = Array.from({ length: 12 }, (_, index) => ({
    label: new Date(0, index).toLocaleString("default", { month: "long" }),
    value: index,
  }));
  const monthNames = Array.from({ length: 12 }, (_, index) =>
    new Date(0, index).toLocaleString("default", { month: "long" })
  );

  const location = useLocation();
  const { userIsAuthenticated } = useLoaderData();
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <div className="flex justify-between items-center p-8">
          <img 
            src={logo} 
            alt="ASP PAL Logo" 
            className="w-48 h-auto mx-auto"
          />
        </div>

        {userIsAuthenticated && !isAuthPage && (
          <div className="flex justify-center gap-4 mb-8">
            <NavLink to="/students">
              <Button className="button-style px-6">
                Students
              </Button>
            </NavLink>
            <NavLink to="/staff">
              <Button className="button-style px-6">
                Staff
              </Button>
            </NavLink>
            <NavLink to="/accounting">
              <Button className="button-style px-6">
                Accounting
              </Button>
            </NavLink>
            <NavLink to="/logout" className="text-blue-600 hover:text-blue-800 self-center">
              Logout
            </NavLink>
          </div>
        )}

        <Outlet />

        {userIsAuthenticated && !isAuthPage && (
          <div className="flex justify-center mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="button-style" variant="outline">
                  {monthNames[selectedMonth]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {months.map((month) => (
                  <DropdownMenuItem
                    className="dropdown-menu-item"
                    key={month.value}
                    onClick={() => setSelectedMonth(month.value)}
                  >
                    {month.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
