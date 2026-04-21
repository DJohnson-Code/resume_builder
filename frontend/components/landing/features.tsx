"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Reveal } from "./reveal"

type Feature = {
  index: string
  label: string
  title: string
  body: string
  preview: React.ReactNode
}

const FEATURES: Feature[] = [
  {
    index: "01",
    label: "VALIDATE",
    title: "A strict schema, kind about it.",
    body:
      "Every section has a contract. Kerning flags missing fields, ambiguous dates, and tone slips — and proposes a concrete fix next to each one.",
    preview: <ValidatePreview />,
  },
  {
    index: "02",
    label: "ASSIST",
    title: "Review that sharpens, never invents.",
    body:
      "Suggestions are grounded in your own notes. Every rewrite shows the source, the change, and why it lands better — you stay in control of your voice.",
    preview: <AssistPreview />,
  },
  {
    index: "03",
    label: "GENERATE",
    title: "One source, every format.",
    body:
      "Export a recruiter-ready PDF, a parser-friendly DOCX, and a portable markdown source from a single canonical resume. Re-export on any change.",
    preview: <GeneratePreview />,
  },
]

export function Features() {
  const [active, setActive] = useState<number>(-1)
  const refs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.matchMedia("(pointer: fine)").matches) return
    // Any hover logic is handled via CSS — this hook keeps state for
    // keyboard focus support.
  }, [])

  return (
    <section id="features" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[min(1380px,94vw)] px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="meta">§ 03 · PRODUCT</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.0] tracking-[-0.018em]">
                A small kit of
                <br />
                sharp tools.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={1}>
              <p className="text-[14.5px] leading-[1.7] text-muted-foreground">
                Not a wall of settings. Three modules that do real work:
                validation that catches what reviewers will, review that
                tightens without rewriting your voice, and export that stays
                readable for both humans and parsers.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.index} delay={((i + 1) as 1 | 2 | 3)}>
              <article
                ref={(el) => {
                  refs.current[i] = el
                }}
                data-cursor="build"
                onFocus={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(-1)}
                className={cn(
                  "panel lift group relative flex h-full flex-col overflow-hidden p-6 md:p-7",
                  active === i && "border-border-strong",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground">
                    {f.index}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    {f.label}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-[1.75rem] leading-[1.05] tracking-[-0.015em]">
                  {f.title}
                </h3>
                <p className="mt-4 text-[13.5px] leading-[1.65] text-muted-foreground">
                  {f.body}
                </p>

                <div className="mt-7 min-h-[260px] flex-1">
                  <div
                    className={cn(
                      "relative h-full overflow-hidden rounded-[14px] border border-border bg-surface-2/40 transition-all duration-500",
                      "group-hover:border-border-strong",
                    )}
                  >
                    {f.preview}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <p className="meta">OPEN · ⌘⇧{f.index.slice(-1)}</p>
                  <span
                    aria-hidden
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-transform duration-300 group-hover:-rotate-45"
                  >
                    →
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────
   Feature previews — small, believable product fragments.
────────────────────────────────────────────────────────────── */

function ValidatePreview() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <p className="meta">REVIEW · pass 01</p>
        <p className="meta">38 CHECKS</p>
      </div>
      <div className="mt-3 space-y-2">
        {[
          ["ok", "Dates consistent"],
          ["warn", "Weak verb in bullet 2"],
          ["err", "Missing metric in bullet 3"],
          ["ok", "No orphaned bullets"],
          ["warn", "Proper nouns in Skills"],
        ].map(([s, t]) => {
          const dot =
            s === "ok"
              ? "bg-[oklch(0.64_0.11_145)]"
              : s === "warn"
                ? "bg-[oklch(0.78_0.13_80)]"
                : "bg-[oklch(0.58_0.18_28)]"
          return (
            <div
              key={t}
              className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-2.5 py-1.5"
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
              <p className="text-[12.5px] text-foreground">{t}</p>
            </div>
          )
        })}
      </div>
      <div className="mt-auto rounded-lg border border-border bg-surface p-3">
        <p className="meta">ATS SCORE</p>
        <div className="mt-2 flex items-end gap-1.5">
          <p className="font-display text-2xl">92.1</p>
          <p className="meta pb-0.5">/ 100</p>
        </div>
        <div className="mt-2 h-1 rounded-full bg-border">
          <div className="h-full w-[92%] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}

function AssistPreview() {
  return (
    <div className="grid h-full grid-cols-2 gap-px bg-border">
      <div className="bg-surface p-4">
        <p className="meta">BEFORE</p>
        <p className="mt-3 text-[12.5px] leading-[1.6] text-muted-foreground">
          <span className="line-through opacity-60">
            worked on migration of services, latency got a lot better.
          </span>
        </p>
        <p className="mt-3 text-[12.5px] leading-[1.6] text-muted-foreground">
          <span className="line-through opacity-60">
            helped with billing, no bad incidents for a while.
          </span>
        </p>
      </div>
      <div className="bg-surface-2/40 p-4">
        <p className="meta">AFTER</p>
        <p className="mt-3 text-[12.5px] leading-[1.6] text-foreground">
          <span className="rounded-[3px] bg-[oklch(0.92_0.08_110)] px-1">
            Led
          </span>{" "}
          migration of 14 services, cutting p99 latency by{" "}
          <span className="rounded-[3px] bg-[oklch(0.92_0.08_110)] px-1">
            41%
          </span>
          .
        </p>
        <p className="mt-3 text-[12.5px] leading-[1.6] text-foreground">
          Shipped the billing rewrite with{" "}
          <span className="rounded-[3px] bg-[oklch(0.92_0.08_110)] px-1">
            zero incidents
          </span>{" "}
          over 9 months.
        </p>
      </div>
    </div>
  )
}

function GeneratePreview() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <p className="meta">EXPORT · bundle</p>
        <p className="meta">READY</p>
      </div>
      <ul className="mt-3 space-y-2">
        {[
          ["PDF", "resume.pdf", "3.2 KB"],
          ["DOCX", "resume.docx", "5.1 KB"],
          ["Markdown", "resume.md", "1.4 KB"],
          ["JSON", "resume.json", "2.0 KB"],
        ].map(([fmt, file, size]) => (
          <li
            key={fmt}
            className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
          >
            <span className="text-[12.5px] font-medium text-foreground">
              {fmt}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {file}
            </span>
            <span className="meta">{size}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-auto inline-flex h-9 w-full items-center justify-center rounded-full bg-foreground text-[12px] font-medium text-background"
      >
        Download · all formats
      </button>
    </div>
  )
}
