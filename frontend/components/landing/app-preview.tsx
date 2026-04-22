"use client"

import { cn } from "@/lib/utils"

type Variant = "compact" | "wide"

/**
 * AppPreview — believable product UI. The left side shows structured input
 * plus review assistance; the right side shows the polished output. Dark UI
 * shell, readable contrast, and restrained product detail.
 */
export function AppPreview({
  variant = "wide",
  className,
}: {
  variant?: Variant
  className?: string
}) {
  return (
    <div
      className={cn(
        "panel-strong relative overflow-hidden",
        variant === "compact" ? "rounded-[22px]" : "rounded-[26px]",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface-2/70 px-5 py-3">
        <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning" />
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="ml-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              kerning · editor
            </span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Chip>autosave</Chip>
          <Chip tone="ok">schema · ok</Chip>
          <Chip tone="muted">v1.08.0</Chip>
        </div>
      </div>

        <div className="grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* Editor column */}
          <div className="border-b border-border md:border-b-0 md:border-r">
            <div className="flex items-center justify-between border-b border-border bg-surface/30 px-5 py-2.5">
              <p className="meta">SECTION · EXPERIENCE</p>
              <p className="meta">3 / 4 COMPLETE</p>
            </div>

          <div className="space-y-4 p-5">
            <Field label="Role">
              <TextLike>Senior Software Engineer</TextLike>
            </Field>
            <Field label="Company">
              <TextLike>Meridian · San Francisco, CA</TextLike>
            </Field>
            <Field label="Dates">
              <div className="flex gap-2">
                <TextLike className="flex-1">2022 · 04</TextLike>
                <TextLike className="flex-1 text-muted-foreground">
                  present
                </TextLike>
              </div>
            </Field>

            <div>
              <div className="flex items-center justify-between">
                <p className="meta">HIGHLIGHTS</p>
                <p className="meta text-foreground">3 · of 5 recommended</p>
              </div>
              <div className="mt-3 space-y-2.5">
                <Bullet status="ok">
                  Led migration of 14 services to an event-driven core,
                  cutting p99 latency by <Mark>41%</Mark>.
                </Bullet>
                <Bullet status="note">
                  Shipped the billing rewrite with{" "}
                  <Mark>zero customer-impacting incidents</Mark> over 9
                  months.
                </Bullet>
                <Bullet status="suggest">
                  Mentored 4 engineers; two promoted to senior in under a
                  year.
                </Bullet>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-2/65 p-3.5">
              <div className="flex items-center justify-between">
                <p className="meta">ASSIST · suggestion</p>
                <span className="font-mono text-[10.5px] text-muted-foreground">
                  ⌘ ⇧ K
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-[1.6] text-foreground">
                Swap <span className="line-through opacity-60">&ldquo;worked on&rdquo;</span>{" "}
                for <Mark>&ldquo;led&rdquo;</Mark>; reviewers scan for ownership
                verbs first.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button className="inline-flex h-7 items-center rounded-full bg-primary px-3 text-[11.5px] font-medium text-primary-foreground">
                  Apply
                </button>
                <button className="inline-flex h-7 items-center rounded-full border border-border px-3 text-[11.5px] text-foreground">
                  Keep mine
                </button>
                <span className="ml-auto meta">3 of 6</span>
              </div>
            </div>
          </div>
          </div>

          {/* Rendered resume column */}
          <div className="bg-[linear-gradient(180deg,oklch(0.955_0.01_85),oklch(0.93_0.01_80))] text-[oklch(0.2_0.01_60)]">
            <div className="flex items-center justify-between border-b border-black/6 bg-black/4 px-5 py-2.5">
              <p className="meta">OUTPUT · resume.md</p>
              <p className="meta">ATS · 97.4 / 100</p>
            </div>
          <div className="p-6 md:p-8">
            <p className="font-display text-[clamp(1.5rem,2.1vw,2rem)] leading-[1.05] tracking-[-0.01em] text-foreground">
              Jordan Avery
            </p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">
              jordan@avery.dev · +1 415 555 0104 · San Francisco
            </p>

            <div className="mt-6 h-px bg-border" />

            <p className="mt-6 meta">EXPERIENCE</p>
            <div className="mt-3 space-y-5">
              <ResumeItem
                role="Senior Software Engineer"
                org="Meridian"
                dates="2022 — Present"
                bullets={[
                  "Led migration of 14 services to an event-driven core, cutting p99 latency by 41%.",
                  "Shipped the billing rewrite with zero customer-impacting incidents over 9 months.",
                  "Mentored 4 engineers; two promoted to senior in under a year.",
                ]}
              />
              <ResumeItem
                role="Software Engineer"
                org="Keel"
                dates="2019 — 2022"
                bullets={[
                  "Built the data platform powering pricing experiments across 11 markets.",
                  "Reduced nightly ETL cost by 62% with incremental materialisation.",
                ]}
              />
            </div>

            <p className="mt-7 meta">SKILLS</p>
            <p className="mt-2 text-[13.5px] leading-[1.7] text-foreground/90">
              Go · TypeScript · Postgres · Kafka · Kubernetes · OpenTelemetry ·
              system design
            </p>
          </div>
        </div>
      </div>

      {/* Footer status strip */}
      <div className="flex items-center justify-between border-t border-border bg-surface-2/60 px-5 py-2.5">
        <div className="flex items-center gap-4">
          <p className="meta">READY TO EXPORT</p>
          <p className="meta text-foreground">· PDF · DOCX · MARKDOWN</p>
        </div>
        <p className="meta">saved · 2s ago</p>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="meta">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function TextLike({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface px-3 py-2 text-[13px] text-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Chip({
  children,
  tone = "default",
}: {
  children: React.ReactNode
  tone?: "default" | "ok" | "muted"
}) {
  const cls =
    tone === "ok"
      ? "border-[oklch(0.72_0.08_145)] bg-[oklch(0.94_0.04_145)] text-[oklch(0.32_0.08_145)]"
      : tone === "muted"
        ? "border-border bg-surface text-muted-foreground"
        : "border-border bg-surface text-foreground"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        cls,
      )}
    >
      {children}
    </span>
  )
}

function Bullet({
  status,
  children,
}: {
  status: "ok" | "note" | "suggest"
  children: React.ReactNode
}) {
  const dot =
    status === "ok"
      ? "bg-[oklch(0.64_0.11_145)]"
      : status === "note"
        ? "bg-foreground"
        : "bg-[oklch(0.78_0.13_80)]"
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
      <span className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
      <p className="text-[13px] leading-[1.55] text-foreground">{children}</p>
    </div>
  )
}

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[3px] bg-[oklch(0.9_0.11_92)] px-1 text-foreground">
      {children}
    </span>
  )
}

function ResumeItem({
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
        <p className="text-[14px] font-medium text-foreground">
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
