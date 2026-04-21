"use client"

import { useEffect, useRef, useState } from "react"
import { AppPreview } from "./app-preview"

/**
 * Hero — bold editorial statement, concise support copy, two clear CTAs,
 * and a parallax-layered product aperture. The section reveals with a
 * blur-to-sharp cascade on mount, then the preview parallaxes on scroll
 * (tiny, disciplined — not a spectacle).
 */
export function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const prev = previewRef.current
    if (!root || !prev) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rect = root.getBoundingClientRect()
        const vh = window.innerHeight
        const t = Math.max(-1, Math.min(1, -rect.top / vh))
        const y = t * 48
        const scale = 1 - Math.min(0.04, Math.max(0, t * 0.04))
        const blur = Math.min(4, Math.max(0, t * 4))
        prev.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`
        prev.style.filter = `blur(${blur}px)`
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative isolate overflow-hidden pb-24 pt-[calc(8rem+env(safe-area-inset-top))] md:pb-32 lg:pb-40"
    >
      <div className="mx-auto max-w-[min(1380px,94vw)] px-2 md:px-6">
        <div
          className={[
            "grid gap-12 lg:grid-cols-12 lg:gap-10",
            "transition-[filter,opacity,transform] duration-[1200ms]",
            entered
              ? "opacity-100 blur-0 translate-y-0"
              : "opacity-0 [filter:blur(14px)] translate-y-4",
          ].join(" ")}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {/* Copy column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="meta">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[oklch(0.64_0.11_145)] align-middle" />
                NOW IN PRIVATE BETA · 2026
              </span>
            </div>

            <h1 className="mt-8 font-display text-[clamp(2.8rem,8vw,6.6rem)] leading-[0.94] tracking-[-0.018em] text-foreground">
              Resumes that
              <br />
              read you right.
            </h1>

            <p className="mt-8 max-w-[38ch] text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.65] text-muted-foreground">
              Kerning turns scattered career notes into a clean, structured,
              ATS-ready resume. Validated as you write. Refined by review.
              Exported on demand.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="/builder"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[14px] font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-[2px]"
              >
                Start your resume
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
              <a
                href="#workflow"
                className="inline-flex h-12 items-center rounded-full border border-border-strong bg-surface px-5 text-[14px] text-foreground transition-colors hover:border-foreground/60"
              >
                See the workflow
              </a>
            </div>

            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-8">
              <HeroStat label="Built for ATS" value="97.4%" sub="parse rate" />
              <HeroStat label="Schema checks" value="38" sub="on every save" />
              <HeroStat label="Avg. review" value="1m 12s" sub="to first clean draft" />
            </dl>
          </div>

          {/* Preview column */}
          <div className="relative lg:col-span-5">
            <div ref={previewRef} className="relative will-change-transform">
              <div
                aria-hidden
                className="absolute -inset-x-10 -inset-y-10 -z-10 rounded-[28px] bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.04_80/0.45),transparent_70%)]"
              />
              <AppPreview variant="compact" />

              {/* Floating annotations that hint at product depth */}
              <Annotation
                className="absolute -left-6 top-10 hidden md:block"
                kind="OK"
                label="All sections validated"
              />
              <Annotation
                className="absolute -right-6 bottom-24 hidden md:block"
                kind="NOTE"
                label="Tone tightened · 3 edits"
              />
            </div>
          </div>
        </div>

        {/* Scroll cue + ruler */}
        <div className="mt-24 flex items-end justify-between border-t border-border pt-6">
          <p className="meta">SCROLL · for the workflow</p>
          <p className="meta hidden md:block">
            TRUSTED BY ENGINEERS AT · ACME · MONOSPACE · COLLATERAL · STRUCT
          </p>
        </div>
      </div>
    </section>
  )
}

function HeroStat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div>
      <dt className="meta">{label}</dt>
      <dd className="mt-3 font-display text-2xl tracking-[-0.01em] text-foreground">
        {value}
      </dd>
      <p className="mt-1 text-[12px] text-muted-foreground">{sub}</p>
    </div>
  )
}

function Annotation({
  className,
  kind,
  label,
}: {
  className?: string
  kind: "OK" | "NOTE" | "WARN"
  label: string
}) {
  const tone =
    kind === "OK"
      ? "bg-[oklch(0.64_0.11_145)]"
      : kind === "WARN"
        ? "bg-[oklch(0.78_0.13_80)]"
        : "bg-foreground"
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3 py-1.5 text-[11px] text-foreground shadow-[0_10px_30px_-18px_oklch(0.18_0.006_60/0.35)] backdrop-blur",
        className ?? "",
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${tone}`} />
      <span className="font-mono uppercase tracking-[0.14em] text-muted-foreground">
        {kind}
      </span>
      <span className="text-foreground/85">{label}</span>
    </div>
  )
}
