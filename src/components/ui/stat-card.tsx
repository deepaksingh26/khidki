import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  note: string;
  tone?: "earth" | "saffron" | "green" | "red";
};

const toneClassName = {
  earth: "bg-white text-khidkee-earth",
  saffron: "bg-khidkee-saffron/10 text-khidkee-earth",
  green: "bg-khidkee-green/10 text-khidkee-earth",
  red: "bg-khidkee-red/10 text-khidkee-earth"
} as const;

export function StatCard({ label, value, note, tone = "earth" }: StatCardProps) {
  return (
    <div className={cn("rounded-[1.5rem] border border-khidkee-earth/10 p-4", toneClassName[tone])}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-khidkee-earth/82">{label}</p>
      <div className="mt-3 font-heading text-4xl font-semibold">{value}</div>
      <p className="mt-2 text-sm leading-6 text-khidkee-earth/88">{note}</p>
    </div>
  );
}
