import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "app/session.server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';

// Function to combine class names
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(...inputs));
}

// Function to count weekdays in a given month
export const countWeekdaysInMonth = (year: number, month: number): { M: number, T: number, W: number, TH: number, F: number } => {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekdayCounts = { M: 0, T: 0, W: 0, TH: 0, F: 0 };
  days.forEach(day => {
    const weekday = format(day, 'EEEEEE');
    switch(weekday) {
      case 'Mo': weekdayCounts['M']++; break;
      case 'Tu': weekdayCounts['T']++; break;
      case 'We': weekdayCounts['W']++; break;
      case 'Th': weekdayCounts['TH']++; break;
      case 'Fr': weekdayCounts['F']++; break;
      default: break;
    }
  });

  return weekdayCounts;
}

// Rates based on the number of days per week a student attends
export const rates = {
  5: 20.00,
  4: 22.50,
  3: 26.66,
  2: 30.00,
  1: 32.50,
};

// Function to calculate the monthly rate based on availability and weekday counts
export const calculateMonthlyRate = (availability: string, weekdayCounts: { M: number, T: number, W: number, TH: number, F: number }): number => {
  const availableDays = availability.split(',').map(day => day.trim());
  const weeklyRate = rates[availableDays.length] || 0; // Rate based on number of days per week

  let totalMonthlyRate = 0;

  availableDays.forEach(day => {
    if (day === 'M') totalMonthlyRate += weeklyRate * weekdayCounts['M'];
    if (day === 'T') totalMonthlyRate += weeklyRate * weekdayCounts['T'];
    if (day === 'W') totalMonthlyRate += weeklyRate * weekdayCounts['W'];
    if (day === 'TH') totalMonthlyRate += weeklyRate * weekdayCounts['TH'];
    if (day === 'F') totalMonthlyRate += weeklyRate * weekdayCounts['F'];
  });

  return totalMonthlyRate;
}

// Function to require user authentication
export const requireUser: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user) {
    throw redirect("/login");
  }

  return user;
};
