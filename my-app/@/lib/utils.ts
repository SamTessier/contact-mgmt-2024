import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs))
}


// BILLING TOOL BELOW //  


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

console.log(countWeekdaysInMonth(2024, 1)); // January 2024
console.log(countWeekdaysInMonth(2024, 2)); // February 2024
console.log(countWeekdaysInMonth(2024, 3)); // March 2024


export const rates = {
  5: 20.00,
  4: 22.50,
  3: 26.66,
  2: 30.00,
  1: 32.50,
};

export const calculateMonthlyRate = (availability: string, weekdayCounts: { M: number, T: number, W: number, TH: number, F: number }): number => {
  let totalDays = 0;

  const availableDays = availability.split(',').map(day => day.trim());

  availableDays.forEach(day => {
    if (day === 'M') totalDays += weekdayCounts['M'];
    if (day === 'T') totalDays += weekdayCounts['T'];
    if (day === 'W') totalDays += weekdayCounts['W'];
    if (day === 'TH') totalDays += weekdayCounts['TH'];
    if (day === 'F') totalDays += weekdayCounts['F'];
  });

  const rates: { [key: number]: number } = {
    5: 20.00,
    4: 22.50,
    3: 26.66,
    2: 30.00,
    1: 32.50,
  };

  const dailyRate = rates[totalDays] || 0;

  console.log(`Availability: ${availability}, Total Days: ${totalDays}, Rate: ${dailyRate}`);

  return dailyRate * totalDays;
}


// END OF BILLING TOOL //