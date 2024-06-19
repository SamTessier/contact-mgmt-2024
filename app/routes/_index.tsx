import { MetaFunction } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";
import { useSelectedMonth } from "context/selectedMonthContext";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
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

  return (
    <div>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1 className="text-4xl font-bold p-8 uppercase">School App</h1>

        <div className="mb-4">
          <NavLink to="/students" className="mr-4">
            <Button variant="outline">Students</Button>
          </NavLink>
          <NavLink to="/staff" className="mr-4">
            <Button variant="outline">Staff</Button>
          </NavLink>
          <NavLink to="/accounting" className="mr-4">
            <Button variant="outline">Accounting</Button>
          </NavLink>
        </div>

        <Outlet />

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
    </div>
  );
}
