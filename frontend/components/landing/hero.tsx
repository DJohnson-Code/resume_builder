"use client"

import { useEffect, useRef, useState } from "react"
import { AppPreview } from "./app-preview"

/**
 * Hero — cinematic first impression with clear product value, a disciplined
 * blur-to-sharp reveal, and a believable product glimpse that subtly shifts
 * in depth on scroll.
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
              <span className="meta eyebrow before:bg-accent/60">
                AI-assisted resume workflow
              </span>
            </div>

            <h1 className="mt-8 max-w-[10.5ch] font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-foreground">
              <span className="font-accent text-accent">Build</span> the resume
              <br />
              that gets
              <span className="font-accent ml-3 inline-block text-accent">
                read.
              </span>
            </h1>

            <p className="mt-8 max-w-[38ch] text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.72] text-muted-foreground">
              Kerning turns rough bullets, old resumes, and scattered career
              notes into a clean, ATS-friendly draft. Structure first.
              Intelligent review next. Polished output when you are ready to
              send.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="/builder"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[14px] font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-[2px]"
              >
                Open the builder
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
              <a
                href="#workflow"
                className="inline-flex h-12 items-center rounded-full border border-border-strong bg-surface/80 px-5 text-[14px] text-foreground transition-colors hover:border-foreground/60"
              >
                See the workflow
              </a>
            </div>

            <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-8">
              <HeroStat label="Structured input" value="JSON" sub="sections, dates, links" />
              <HeroStat label="Validation" value="Live" sub="schema + wording checks" />
              <HeroStat label="Output" value="ATS" sub="clean markdown + export" />
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
                 label="Validation clean"
               />
               <Annotation
                 className="absolute -right-6 bottom-24 hidden md:block"
                 kind="NOTE"
                 label="3 edits suggested"
               />
            </div>
          </div>
        </div>

        {/* Scroll cue + ruler */}
        <div className="mt-24 flex items-end justify-between border-t border-border pt-6">
          <p className="meta">Scroll for the product flow</p>
          <p className="meta hidden md:block">
            STRUCTURED INPUT · LIVE VALIDATION · GUIDED IMPROVEMENT · ATS OUTPUT
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
      <dd className="mt-3 font-display text-2xl tracking-[-0.03em] text-foreground">
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
