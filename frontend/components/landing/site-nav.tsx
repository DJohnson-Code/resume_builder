"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "#trust", label: "Quality" },
  { href: "#faq", label: "Notes" },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActive(`#${visible[0].target.id}`)
        } else if (window.scrollY < window.innerHeight * 0.5) {
          setActive(null)
        }
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: [0, 0.2, 0.5, 1],
      },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[padding,background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "pt-3" : "pt-6",
      )}
    >
      <div className="mx-auto flex max-w-[min(1380px,94vw)] items-center justify-between">
        <div
          className={cn(
            "flex w-full items-center justify-between rounded-full border px-5 py-2.5 transition-all duration-500",
            scrolled
              ? "border-border-strong bg-surface/82 backdrop-blur-2xl shadow-[0_26px_60px_-38px_oklch(0.3_0.02_55/0.28)]"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="font-display text-[17px] leading-none text-foreground">
              Kerning
            </span>
            <span className="ml-1 hidden font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-foreground md:inline">
              AI resume builder
            </span>
          </a>

          <nav className="hidden items-center gap-1.5 md:flex">
            {LINKS.map((l) => {
              const isActive = active === l.href
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-3.5 text-[13px] transition-[background-color,color,box-shadow] duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_10px_26px_-14px_oklch(0.3_0.02_55/0.42)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l.label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/builder"
              className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-[12.5px] font-medium tracking-[0.01em] text-primary-foreground transition-transform duration-300 hover:-translate-y-[1px]"
            >
              Open builder
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="grid h-8 w-8 place-items-center rounded-[10px] border border-border-strong bg-surface-3/80 text-accent"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
        <path
          d="M5 4h7a5 5 0 0 1 0 10H7m0 0h5.5a5 5 0 0 1 0 10H5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
      </svg>
    </span>
  )
}
