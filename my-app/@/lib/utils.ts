import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function countWeekdaysInMonth(year, month) {
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

