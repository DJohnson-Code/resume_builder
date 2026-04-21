"use client"

import { useEffect, useRef } from "react"
import { Reveal } from "./reveal"

/**
 * Trust — a centerpiece panel that explains ATS-friendliness, sample
 * parsing output, and the quality bar. A subtle scale-on-scroll makes
 * the panel feel anchored without being theatrical.
 */
export function Trust() {
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const center = rect.top + rect.height / 2
        const d = Math.max(-1, Math.min(1, (center - vh / 2) / (vh * 0.9)))
        const scale = 0.97 + (1 - Math.abs(d)) * 0.03
        el.style.transform = `scale(${scale})`
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="trust" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[min(1380px,94vw)] px-6">
        <div className="grid gap-10 border-b border-border pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="meta">§ 04 · ATS</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.0] tracking-[-0.018em]">
                Clean for
                <br />
                parsers. Clean
                <br />
                for people.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={1}>
              <p className="text-[14.5px] leading-[1.7] text-muted-foreground">
                Kerning resumes are built from a strict document model. No
                hidden tables, no rasterised logos, no columns that confuse a
                parser. What a human reads and what a system extracts are the
                same story.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-6">
                <Stat value="97.4%" label="parse rate · avg" />
                <Stat value="0" label="tables in output" />
                <Stat value="12pt" label="body baseline" />
              </dl>
            </Reveal>
          </div>
        </div>

        <div className="mt-14">
          <Reveal variant="scale">
            <div
              ref={panelRef}
              className="panel-strong grid origin-center overflow-hidden rounded-[24px] will-change-transform md:grid-cols-[1.1fr_1fr]"
              style={{ transition: "transform 120ms linear" }}
            >
              {/* Rendered resume */}
              <div className="relative bg-[oklch(0.995_0.003_85)] p-8 md:p-12">
                <p className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.02] tracking-[-0.015em]">
                  Jordan Avery
                </p>
                <p className="mt-1 text-[12.5px] text-muted-foreground">
                  jordan@avery.dev · +1 415 555 0104 · San Francisco
                </p>
                <div className="mt-6 h-px bg-border" />
                <p className="mt-6 meta">EXPERIENCE</p>
                <div className="mt-3 space-y-5">
                  <ResumeLine
                    role="Senior Software Engineer"
                    org="Meridian"
                    dates="2022 — Present"
                    bullets={[
                      "Led migration of 14 services to an event-driven core, cutting p99 latency by 41%.",
                      "Shipped the billing rewrite with zero customer-impacting incidents over 9 months.",
                      "Mentored 4 engineers; two promoted to senior in under a year.",
                    ]}
                  />
                  <ResumeLine
                    role="Software Engineer"
                    org="Keel"
                    dates="2019 — 2022"
                    bullets={[
                      "Built the data platform powering pricing experiments across 11 markets.",
                    ]}
                  />
                </div>
                <p className="mt-6 meta">SKILLS</p>
                <p className="mt-2 text-[13.5px] leading-[1.7] text-foreground/90">
                  Go · TypeScript · Postgres · Kafka · Kubernetes · OpenTelemetry
                </p>
              </div>

              {/* Parser view */}
              <div className="bg-surface-2/40 p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <p className="meta">PARSER · EXTRACTED</p>
                  <p className="meta">97.4 / 100</p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-[12.5px]">
                  <KV k="name" v="Jordan Avery" />
                  <KV k="email" v="jordan@avery.dev" />
                  <KV k="phone" v="+1 415 555 0104" />
                  <KV k="location" v="San Francisco" />
                </div>

                <div className="mt-6">
                  <p className="meta">EXPERIENCE · 2 ENTRIES</p>
                  <div className="mt-3 space-y-3">
                    <ExtractedRow
                      title="Senior Software Engineer · Meridian"
                      meta="2022-04 → present · 3 bullets"
                    />
                    <ExtractedRow
                      title="Software Engineer · Keel"
                      meta="2019-06 → 2022-03 · 1 bullet"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="meta">SIGNALS</p>
                  <ul className="mt-3 space-y-2 text-[12.5px]">
                    <Signal label="Ownership verbs" value="100%" tone="ok" />
                    <Signal label="Quantified bullets" value="86%" tone="ok" />
                    <Signal label="Date coverage" value="complete" tone="ok" />
                    <Signal label="Table count" value="0" tone="ok" />
                    <Signal label="Orphaned fields" value="0" tone="ok" />
                  </ul>
                </div>

                <p className="meta mt-8">PARSED AGAINST · Greenhouse · Lever · Workday · iCIMS</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl tracking-[-0.01em] text-foreground">
        {value}
      </dt>
      <dd className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dd>
    </div>
  )
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2">
      <p className="meta">{k}</p>
      <p className="mt-1 text-[12.5px] text-foreground">{v}</p>
    </div>
  )
}

function ExtractedRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
      <p className="text-[12.5px] font-medium text-foreground">{title}</p>
      <p className="font-mono text-[11px] text-muted-foreground">{meta}</p>
    </div>
  )
}

function Signal({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "ok" | "warn" | "err"
}) {
  const dot =
    tone === "ok"
      ? "bg-[oklch(0.64_0.11_145)]"
      : tone === "warn"
        ? "bg-[oklch(0.78_0.13_80)]"
        : "bg-[oklch(0.58_0.18_28)]"
  return (
    <li className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="text-foreground">{label}</span>
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">
        {value}
      </span>
    </li>
  )
}

function ResumeLine({
  role,
  org,
  dates,
  bullets,
}: {
  role: string
  org: string
  dates: string
  bullets: string[]
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[14px] font-medium">
          {role} · {org}
        </p>
        <p className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {dates}
        </p>
      </div>
      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[13px] leading-[1.6] text-foreground/90">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  )
}
