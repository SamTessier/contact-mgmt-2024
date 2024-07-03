import { LoaderFunction, redirect } from "@remix-run/node";
import { authorize, getSessionData } from "app/googlesheetsserver";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from "date-fns";

// Function to combine class names
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(...inputs));
};

// Function to count weekdays in a given month
export const countWeekdaysInMonth = (
  year: number,
  month: number
): { M: number; T: number; W: number; TH: number; F: number } => {
  const startDate = startOfMonth(new Date(year, month - 1));
  const endDate = endOfMonth(new Date(year, month - 1));
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekdayCounts = { M: 0, T: 0, W: 0, TH: 0, F: 0 };
  days.forEach((day) => {
    const weekday = format(day, "EEEEEE");
    switch (weekday) {
      case "Mo":
        weekdayCounts["M"]++;
        break;
      case "Tu":
        weekdayCounts["T"]++;
        break;
      case "We":
        weekdayCounts["W"]++;
        break;
      case "Th":
        weekdayCounts["TH"]++;
        break;
      case "Fr":
        weekdayCounts["F"]++;
        break;
      default:
        break;
    }
  });

  return weekdayCounts;
};

// Rates based on the number of days per week a student attends
export const rates = {
  5: 20.0,
  4: 22.5,
  3: 26.66,
  2: 30.0,
  1: 32.5,
};

// Function to calculate the monthly rate based on availability and weekday counts
export const calculateMonthlyRate = (
  availability: string,
  weekdayCounts: { M: number; T: number; W: number; TH: number; F: number }
): number => {
  const availableDays = availability.split(",").map((day) => day.trim());
  const weeklyRate = rates[availableDays.length] || 0; // Rate based on number of days per week

  let totalMonthlyRate = 0;

  availableDays.forEach((day) => {
    if (day === "M") totalMonthlyRate += weeklyRate * weekdayCounts["M"];
    if (day === "T") totalMonthlyRate += weeklyRate * weekdayCounts["T"];
    if (day === "W") totalMonthlyRate += weeklyRate * weekdayCounts["W"];
    if (day === "TH") totalMonthlyRate += weeklyRate * weekdayCounts["TH"];
    if (day === "F") totalMonthlyRate += weeklyRate * weekdayCounts["F"];
  });

  return totalMonthlyRate;
};

// Function to require user authentication
export const requireUser: LoaderFunction = async ({ request, params, context }) => {
  const sessionCookie = request.headers.get("Cookie");
  if (!sessionCookie) {
    throw redirect("/login");
  }
  const auth = await authorize();
  const sessionId = sessionCookie.split("=")[1];
  const session = await getSessionData(auth, sessionId);

  if (!session || !session.userId) {
    throw redirect("/login");
  }

  return session;
};

// Function to calculate staff/student ratios
export const calculateRatios = (
  staff: any[],
  students: any[],
  day: string
) => {
  const schoolStats: {
    [key: string]: { staffCount: number; studentCount: number };
  } = {};

  staff.forEach(({ school, availability }) => {
    if (availability.includes(day)) {
      if (!schoolStats[school])
        schoolStats[school] = { staffCount: 0, studentCount: 0 };
      schoolStats[school].staffCount++;
    }
  });

  students.forEach(({ school, weeklySchedule }) => {
    if (weeklySchedule.includes(day)) {
      if (!schoolStats[school])
        schoolStats[school] = { staffCount: 0, studentCount: 0 };
      schoolStats[school].studentCount++;
    }
  });

  return Object.keys(schoolStats).map((school) => ({
    school,
    ratio:
      schoolStats[school].staffCount > 0
        ? schoolStats[school].studentCount / schoolStats[school].staffCount
        : 0,
  }));
};
