import { cn } from "@/lib/utils"

interface MarqueeProps {
  items: string[]
  className?: string
}

export function Marquee({ items, className }: MarqueeProps) {
  // Duplicate list so the CSS translateX(-50%) loop is seamless.
  const doubled = [...items, ...items]

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-border/60 bg-background/40 py-5",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-12 font-serif text-2xl italic text-foreground/80"
          >
            <span>{item}</span>
            <span
              aria-hidden
              className="inline-block h-1 w-1 rounded-full bg-accent/70"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
