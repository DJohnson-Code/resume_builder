"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Step = {
  index: string
  eyebrow: string
  title: string
  body: string
  chips: string[]
}

const STEPS: Step[] = [
  {
    index: "01",
    eyebrow: "INGEST",
    title: "Bring every version into one structured draft.",
    body:
      "Start from a pasted resume, a LinkedIn export, or rough notes. Kerning pulls that material into a clean model with the fields hiring teams and ATS systems both need.",
    chips: ["Sections", "Dates", "Links", "Experience"],
  },
  {
    index: "02",
    eyebrow: "VALIDATE",
    title: "Catch weak points before recruiters do.",
    body:
      "Every section runs through a strict schema, parser checks, and content linting. Missing dates, soft bullets, and inconsistent formatting are surfaced while the draft is still in motion.",
    chips: ["Schema", "Tone", "Dates", "Verbs"],
  },
  {
    index: "03",
    eyebrow: "IMPROVE",
    title: "Sharpen the writing without losing your voice.",
    body:
      "Suggestions stay grounded in your own material. Kerning rewrites for clarity, stronger verbs, and tighter structure while keeping every change inspectable.",
    chips: ["Rewrite", "Quantify", "Trim", "Compare"],
  },
  {
    index: "04",
    eyebrow: "GENERATE",
    title: "Generate the version you can send.",
    body:
      "Export clean markdown and production-friendly files from the same canonical source. Human-readable. ATS-friendly. Easy to revise the next time the story changes.",
    chips: ["PDF", "DOCX", "Markdown", "ATS report"],
  },
]

export function Workflow() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let raf = 0
    const tick = () => {
      raf = 0
      const rect = wrapper.getBoundingClientRect()
      const scrollable = wrapper.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / scrollable))
      setProgress(p)
      const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length * 0.999))
      setActive(idx)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const stepT = progress * (STEPS.length - 1)

  return (
    <section id="workflow" className="relative">
      <div className="mx-auto max-w-[min(1380px,94vw)] px-6 pt-28 md:pt-40">
        <div className="flex items-end justify-between gap-8 border-b border-border pb-8">
          <div>
            <p className="meta">§ 02 · WORKFLOW</p>
            <h2 className="mt-6 max-w-[22ch] font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.98] tracking-[-0.018em]">
              Four steps. One
              <br />
              cleaner draft.
            </h2>
          </div>
          <p className="hidden max-w-sm text-[14px] leading-[1.65] text-muted-foreground md:block">
            A real product flow, not a pitch deck. Input comes in rough,
            validation makes the issues visible, and the final output leaves in
            a format you can actually use.
          </p>
        </div>
      </div>

      {/* Sticky depth rail. Panels resolve through depth as the user scrolls
          the workflow, keeping the sequence spatial rather than just linear. */}
      <div
        ref={wrapperRef}
        style={{ height: `${100 + STEPS.length * 70}vh` }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[min(1380px,94vw)] grid-cols-12 gap-6 px-6">
            {/* Caption column — pinned, swaps with progress */}
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <StepCaption step={STEPS[active]} progress={progress} />

              <ol className="mt-10 space-y-2.5">
                {STEPS.map((s, i) => {
                  const isActive = i === active
                  return (
                    <li key={s.index} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "h-px transition-[width,background-color] duration-500",
                          isActive
                            ? "w-12 bg-foreground"
                            : "w-6 bg-border-strong",
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {s.index} · {s.eyebrow}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Stage — layered depth. Panels are positioned in 3D; the
                active panel rests at z=0, others push back in scale and
                blur. The transition is driven continuously by stepT so
                panels pass smoothly through each other. */}
            <div
              className="col-span-12 md:col-span-7 lg:col-span-8"
              style={{ perspective: "1400px" }}
            >
              <div className="relative aspect-[5/4] w-full [transform-style:preserve-3d]">
                <StagePanel
                  t={0 - stepT}
                  kind="organize"
                />
                <StagePanel
                  t={1 - stepT}
                  kind="validate"
                />
                <StagePanel
                  t={2 - stepT}
                  kind="improve"
                />
                <StagePanel
                  t={3 - stepT}
                  kind="generate"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress ruler (fixed above the sticky stage bottom) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-[min(1380px,94vw)] items-center gap-4 px-6">
                <p className="meta">{STEPS[active].eyebrow}</p>
          <div className="relative h-px flex-1 bg-border">
            <div
              className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-75 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="meta">
            {String(active + 1).padStart(2, "0")} / 0{STEPS.length}
          </p>
        </div>
      </div>
    </section>
  )
}

function StepCaption({
  step,
  progress,
}: {
  step: Step
  progress: number
}) {
  return (
    <div key={step.index} className="min-h-[280px]">
      <p className="meta">
        § {step.index} · {step.eyebrow}
      </p>
      <h3 className="mt-6 font-display text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.02] tracking-[-0.015em]">
        {step.title}
      </h3>
      <p className="mt-5 max-w-md text-[14.5px] leading-[1.7] text-muted-foreground">
        {step.body}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {step.chips.map((c) => (
          <span
            key={c}
            className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground"
          >
            {c}
          </span>
        ))}
      </div>
      <p className="meta mt-8">
        PROGRESS · {Math.round(progress * 100)}%
      </p>
    </div>
  )
}

/**
 * StagePanel — one layer in the 3D stack. `t` is the distance in steps
 * from the active panel: 0 = front, 1 = one behind, -1 = one in front.
 * We clamp translate and blur so the scene feels cinematic, not cheap.
 */
function StagePanel({
  t,
  kind,
}: {
  t: number
  kind: "organize" | "validate" | "improve" | "generate"
}) {
  const clamped = Math.max(-1.2, Math.min(1.2, t))
  const opacity =
    clamped < -0.6 ? 0 : clamped > 1.05 ? 0 : 1 - Math.min(0.75, Math.abs(clamped) * 0.55)
  const translateZ = -Math.abs(clamped) * 120
  const translateY = clamped * -14
  const translateX = clamped * 22
  const scale = 1 - Math.abs(clamped) * 0.06
  const blur = Math.min(6, Math.abs(clamped) * 6)
  const rotateY = clamped * -1.8

  return (
    <div
      aria-hidden={t !== 0}
      className="absolute inset-0 will-change-transform"
      style={{
        transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        transition: "transform 120ms linear, filter 120ms linear, opacity 120ms linear",
      }}
    >
      {kind === "organize" && <StageOrganize />}
      {kind === "validate" && <StageValidate />}
      {kind === "improve" && <StageImprove />}
      {kind === "generate" && <StageGenerate />}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Stage contents — each is a polished fragment of the product,
   chosen to make the phase feel tangible.
────────────────────────────────────────────────────────────── */

function StageFrame({
  title,
  chip,
  children,
}: {
  title: string
  chip: string
  children: React.ReactNode
}) {
  return (
    <div className="panel-strong h-full w-full overflow-hidden rounded-[22px]">
      <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-5 py-3">
        <p className="meta">{title}</p>
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground">
          {chip}
        </span>
      </div>
      <div className="h-[calc(100%-46px)] overflow-hidden">{children}</div>
    </div>
  )
}

function StageOrganize() {
  return (
    <StageFrame title="KERNING · ORGANIZE" chip="draft">
      <div className="grid h-full grid-cols-[200px_minmax(0,1fr)]">
        <aside className="border-r border-border bg-surface/40 p-4">
          <p className="meta">SECTIONS</p>
          <ul className="mt-3 space-y-1.5 text-[13px]">
            {[
              ["01", "Profile", true],
              ["02", "Experience", true],
              ["03", "Projects", false],
              ["04", "Education", true],
              ["05", "Skills", true],
              ["06", "Links", false],
            ].map(([i, label, done]) => (
              <li
                key={String(i)}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5",
                  done ? "bg-surface text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground">
                  {i}
                </span>
                <span className="flex-1 pl-3">{label as string}</span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    done ? "bg-[oklch(0.64_0.11_145)]" : "bg-border-strong",
                  )}
                />
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-col gap-4 p-5">
          <div className="grid grid-cols-3 gap-3">
            {["Role", "Company", "Location"].map((l) => (
              <div key={l}>
                <p className="meta">{l}</p>
                <div className="mt-2 h-9 rounded-md border border-border bg-surface px-3 leading-9 text-[13px] text-foreground">
                  {l === "Role"
                    ? "Senior Software Engineer"
                    : l === "Company"
                      ? "Meridian"
                      : "San Francisco, CA"}
                </div>
              </div>
            ))}
          </div>
          <div>
            <p className="meta">HIGHLIGHTS · raw notes</p>
            <div className="mt-2 space-y-2 rounded-lg border border-dashed border-border-strong bg-surface/60 p-3.5 text-[13px] leading-[1.55] text-foreground/85">
              <p>worked on billing rewrite, went well, no incidents</p>
              <p>migrated services to events, latency went down a lot</p>
              <p>mentored some juniors, two got promoted</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {["tags", "dates", "metrics", "tone"].map((l) => (
              <div
                key={l}
                className="rounded-lg border border-border bg-surface/60 p-3"
              >
                <p className="meta">{l}</p>
                <p className="mt-2 font-display text-xl tracking-[-0.01em]">
                  {l === "tags"
                    ? "18"
                    : l === "dates"
                      ? "OK"
                      : l === "metrics"
                        ? "3"
                        : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StageFrame>
  )
}

function StageValidate() {
  return (
    <StageFrame title="KERNING · VALIDATE" chip="live">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_260px]">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="meta">REVIEW · PASS 01 of 03</p>
            <p className="meta">38 CHECKS</p>
          </div>
          <div className="mt-3 space-y-2.5">
            <Row
              state="ok"
              title="Dates are consistent"
              detail="All entries use YYYY — YYYY"
            />
            <Row
              state="warn"
              title="Weak opener in Experience · 02"
              detail="Replace “worked on” with an ownership verb."
            />
            <Row
              state="err"
              title="Missing metric in Experience · 03"
              detail="Quantify impact — revenue, latency, headcount."
            />
            <Row
              state="ok"
              title="No orphaned bullets"
              detail="Every bullet maps to a role or project."
            />
            <Row
              state="warn"
              title="Tone drift · Skills"
              detail="Capitalise proper nouns: Postgres, Kubernetes."
            />
          </div>
        </div>
        <aside className="border-l border-border bg-surface/40 p-5">
          <p className="meta">SUMMARY</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat label="ok" value="24" tone="ok" />
            <MiniStat label="warn" value="11" tone="warn" />
            <MiniStat label="err" value="3" tone="err" />
          </div>
          <p className="meta mt-6">ATS SCORE</p>
          <div className="mt-3 flex items-end gap-2">
            <p className="font-display text-4xl tracking-[-0.015em]">92.1</p>
            <p className="pb-1 meta">/ 100</p>
          </div>
          <div className="mt-3 h-1 rounded-full bg-border">
            <div className="h-full w-[92%] rounded-full bg-foreground" />
          </div>
          <p className="meta mt-6">FIX ALL · ⌘⇧F</p>
        </aside>
      </div>
    </StageFrame>
  )
}

function StageImprove() {
  return (
    <StageFrame title="KERNING · IMPROVE" chip="review">
      <div className="grid h-full grid-cols-2 gap-px bg-border">
        <div className="bg-surface p-5">
          <p className="meta">BEFORE</p>
          <div className="mt-3 space-y-3 text-[13.5px] leading-[1.6] text-foreground/85">
            <p>
              <span className="line-through opacity-50">
                Worked on migrating some services to event-driven architecture
                and latency got better.
              </span>
            </p>
            <p>
              <span className="line-through opacity-50">
                Helped with billing, no bad incidents for a while.
              </span>
            </p>
            <p>
              <span className="line-through opacity-50">
                Mentored juniors, some were promoted.
              </span>
            </p>
          </div>
        </div>
        <div className="bg-[oklch(0.995_0.003_85)] p-5">
          <p className="meta">AFTER · kerning</p>
          <div className="mt-3 space-y-3 text-[13.5px] leading-[1.6] text-foreground">
            <p>
              <span className="rounded-[3px] bg-[oklch(0.92_0.08_110)] px-1">
                Led
              </span>{" "}
              migration of 14 services to an event-driven core, cutting p99
              latency by <span className="rounded-[3px] bg-[oklch(0.92_0.08_110)] px-1">41%</span>.
            </p>
            <p>
              Shipped the billing rewrite with{" "}
              <span className="rounded-[3px] bg-[oklch(0.92_0.08_110)] px-1">
                zero customer-impacting incidents
              </span>{" "}
              over 9 months.
            </p>
            <p>
              Mentored 4 engineers;{" "}
              <span className="rounded-[3px] bg-[oklch(0.92_0.08_110)] px-1">
                two promoted to senior
              </span>{" "}
              within a year.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="inline-flex h-8 items-center rounded-full bg-foreground px-3 text-[12px] font-medium text-background">
              Apply all
            </button>
            <button className="inline-flex h-8 items-center rounded-full border border-border px-3 text-[12px]">
              Review one by one
            </button>
          </div>
        </div>
      </div>
    </StageFrame>
  )
}

function StageGenerate() {
  return (
    <StageFrame title="KERNING · GENERATE" chip="ready">
      <div className="grid h-full grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative bg-[oklch(0.995_0.003_85)] p-6 md:p-7">
          <p className="font-display text-3xl leading-[1.02] tracking-[-0.015em]">
            Jordan Avery
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            jordan@avery.dev · +1 415 555 0104 · San Francisco
          </p>
          <div className="mt-5 h-px bg-border" />
          <p className="mt-5 meta">EXPERIENCE</p>
          <div className="mt-3 space-y-4">
            <ResumeLine
              role="Senior Software Engineer"
              org="Meridian"
              dates="2022 — Present"
              bullets={[
                "Led migration of 14 services to an event-driven core, cutting p99 latency by 41%.",
                "Shipped the billing rewrite with zero customer-impacting incidents over 9 months.",
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
          <p className="mt-5 meta">SKILLS</p>
          <p className="mt-2 text-[12.5px] leading-[1.65] text-foreground">
            Go · TypeScript · Postgres · Kafka · Kubernetes · OpenTelemetry
          </p>

          <div className="absolute right-6 top-6 rotate-[4deg] rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            ATS · 97.4
          </div>
        </div>
        <aside className="border-l border-border bg-surface/50 p-5">
          <p className="meta">EXPORT</p>
          <ul className="mt-4 space-y-2 text-[13px]">
            {[
              ["PDF", "resume.pdf", "crisp"],
              ["DOCX", "resume.docx", "parser-ready"],
              ["Markdown", "resume.md", "source"],
              ["JSON", "resume.json", "portable"],
            ].map(([fmt, file, note]) => (
              <li
                key={fmt}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2"
              >
                <span className="font-medium text-foreground">{fmt}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {file}
                </span>
                <span className="meta">{note}</span>
              </li>
            ))}
          </ul>
          <button className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-full bg-foreground text-[12.5px] font-medium text-background">
            Download bundle
          </button>
        </aside>
      </div>
    </StageFrame>
  )
}

function Row({
  state,
  title,
  detail,
}: {
  state: "ok" | "warn" | "err"
  title: string
  detail: string
}) {
  const dot =
    state === "ok"
      ? "bg-[oklch(0.64_0.11_145)]"
      : state === "warn"
        ? "bg-[oklch(0.78_0.13_80)]"
        : "bg-[oklch(0.58_0.18_28)]"
  const label = state === "ok" ? "OK" : state === "warn" ? "WARN" : "ERR"
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface px-3.5 py-2.5">
      <span className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </span>
          <p className="text-[13px] font-medium text-foreground">{title}</p>
        </div>
        <p className="mt-0.5 text-[12.5px] leading-[1.55] text-muted-foreground">
          {detail}
        </p>
      </div>
    </div>
  )
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "ok" | "warn" | "err"
}) {
  const bg =
    tone === "ok"
      ? "bg-[oklch(0.94_0.04_145)] text-[oklch(0.32_0.08_145)]"
      : tone === "warn"
        ? "bg-[oklch(0.96_0.05_85)] text-[oklch(0.4_0.1_75)]"
        : "bg-[oklch(0.96_0.05_28)] text-[oklch(0.4_0.12_28)]"
  return (
    <div className={cn("rounded-md px-3 py-2", bg)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em]">
        {label}
      </p>
      <p className="mt-1 font-display text-xl">{value}</p>
    </div>
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
        <p className="text-[13.5px] font-medium">
          {role} · {org}
        </p>
        <p className="shrink-0 font-mono text-[10.5px] text-muted-foreground">
          {dates}
        </p>
      </div>
      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[12.5px] leading-[1.55] text-foreground/90">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  )
}
