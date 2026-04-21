"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: ReactNode
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  delay?: 0 | 1 | 2 | 3 | 4
  variant?: "rise" | "scale"
  threshold?: number
  /** If true, will reveal once and disconnect. */
  once?: boolean
}

/**
 * Reveal — blur-to-sharp entry driven by IntersectionObserver. Small,
 * consistent primitive so motion feels choreographed page-wide.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  variant = "rise",
  threshold = 0.18,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove("is-visible")
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once])

  const Tag = as as React.ElementType
  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      data-delay={delay}
      className={cn(variant === "scale" ? "scale-reveal" : "reveal", className)}
    >
      {children}
    </Tag>
  )
}
