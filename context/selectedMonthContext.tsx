import { createContext, useContext, ReactNode, useState } from 'react';

interface SelectedMonthContextType {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

const SelectedMonthContext = createContext<SelectedMonthContextType | undefined>(undefined);

export const SelectedMonthProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  return (
    <SelectedMonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </SelectedMonthContext.Provider>
  );
};

export const useSelectedMonth = () => {
  const context = useContext(SelectedMonthContext);
  if (context === undefined) {
    throw new Error('useSelectedMonth must be used within a SelectedMonthProvider');
  }
  return context;
};
