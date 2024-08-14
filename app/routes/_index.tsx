import { MetaFunction, LoaderFunction, json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData, useLocation, Link } from "@remix-run/react";
import { useSelectedMonth } from "context/selectedMonthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { authenticateUser } from "../auth";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userIsAuthenticated = await authenticateUser(request);
  return json({ userIsAuthenticated });
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
  
  // Hide navigation if on login or signup page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <div className="flex justify-between items-center p-8">
          <h1 className="text-4xl font-bold uppercase">School App</h1>
          {userIsAuthenticated && (
            <Link to="/logout" className="text-blue-600 underline">
              Logout
            </Link>
          )}
        </div>

        {!isAuthPage && userIsAuthenticated && (
          <div className="flex justify-center mb-4">
            <NavLink to="/students" className="mr-4">
              <Button className="button-style">Students</Button>
            </NavLink>
            <NavLink to="/staff" className="mr-4">
              <Button className="button-style">Staff</Button>
            </NavLink>
            <NavLink to="/accounting" className="mr-4">
              <Button className="button-style">Accounting</Button>
            </NavLink>
            <NavLink to="/logout" className="text-blue-600 underline">
              Logout
            </NavLink>
          </div>
        )}

        <Outlet />

        {userIsAuthenticated && (
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
        )}
      </div>
    </div>
  );
}
