import { cn } from "@/lib/utils";

interface InfoItem {
  label: string;
  value: string | number;
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  items: InfoItem[];
  className?: string;
}

export function InfoCard({ icon, title, items, className }: InfoCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-full bg-primary-50 text-primary-700">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-muted-foreground">{item.label}:</span>
            <span className="font-medium">{item.value || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 