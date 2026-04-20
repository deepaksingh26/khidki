import Image from "next/image";
import { cn } from "@/lib/utils";

type KhidkeeLogoProps = {
  className?: string;
  showWordmark?: boolean;
  surface?: "plain" | "panel";
};

export function KhidkeeLogo({
  className,
  showWordmark = true,
  surface = "plain"
}: KhidkeeLogoProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center",
        surface === "panel" && "rounded-[1.35rem] bg-khidkee-cream px-4 py-3 shadow-[0_18px_45px_rgba(28,15,0,0.18)]",
        className
      )}
    >
      <Image
        src={showWordmark ? "/khidkee-logo-full.svg" : "/icon.svg"}
        alt="Khidkee"
        width={showWordmark ? 236 : 44}
        height={showWordmark ? 48 : 44}
        className={cn(showWordmark ? "h-11 w-auto sm:h-12" : "h-11 w-11", "max-w-none")}
      />
    </div>
  );
}
