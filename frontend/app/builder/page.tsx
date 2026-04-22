"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import {
  validateResume,
  generateResume,
  type ApiResponse,
  type ResumeOut,
} from "@/lib/api"
import { sampleResume } from "@/lib/sample-resume"

type LocationIn = {
  country?: string
  state?: string
  city?: string
}

type ExperienceIn = {
  company: string
  position: string[]
  start_date: string | null
  end_date: string | null
  description: string[]
  location: string
}

type EducationIn = {
  school: string
  degree: string
  start_date: string | null
  graduation_date: string | null
  gpa?: number | null
}

type ResumeIn = {
  name: string
  email: string
  phone: string
  location?: LocationIn
  urls?: string[]
  experience?: ExperienceIn[]
  skills?: string[]
  education?: EducationIn[]
}

type SectionId = "profile" | "experience" | "skills" | "education" | "review"

const SECTIONS: Array<{ id: SectionId; index: string; label: string; hint: string }> = [
  { id: "profile", index: "01", label: "Profile", hint: "Name, contact, location" },
  { id: "experience", index: "02", label: "Experience", hint: "Roles & achievements" },
  { id: "skills", index: "03", label: "Skills", hint: "Tools and technologies" },
  { id: "education", index: "04", label: "Education", hint: "Schools & degrees" },
  { id: "review", index: "05", label: "Review & export", hint: "Validate, generate, export" },
]

const emptyExperience = (): ExperienceIn => ({
  company: "",
  position: [""],
  start_date: "",
  end_date: null,
  description: [""],
  location: "",
})

const emptyEducation = (): EducationIn => ({
  school: "",
  degree: "",
  start_date: "",
  graduation_date: "",
  gpa: null,
})

export default function BuilderPage() {
  const [resume, setResume] = useState<ResumeIn>(sampleResume as ResumeIn)
  const [active, setActive] = useState<SectionId>("profile")
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [validationResult, setValidationResult] =
    useState<ApiResponse<ResumeOut> | null>(null)
  const [generateResult, setGenerateResult] =
    useState<ApiResponse<ResumeOut> | null>(null)

  const completion = useMemo(() => sectionCompletion(resume), [resume])

  const handleValidate = async () => {
    setIsValidating(true)
    setValidationResult(null)
    const result = await validateResume(serializeResume(resume), apiKey)
    setValidationResult(result)
    setIsValidating(false)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerateResult(null)
    const result = await generateResume(serializeResume(resume), apiKey)
    setGenerateResult(result)
    setIsGenerating(false)
  }

  const markdown =
    generateResult?.success && generateResult.data
      ? generateResult.data.ai_resume_markdown ?? null
      : null
  const warnings =
    validationResult?.success && validationResult.data
      ? validationResult.data.warnings
      : null

  return (
    <main className="relative min-h-screen">
      <TopBar
        apiKey={apiKey}
        setApiKey={setApiKey}
        isValidating={isValidating}
        isGenerating={isGenerating}
        onValidate={handleValidate}
        onGenerate={handleGenerate}
      />

      <div className="mx-auto flex max-w-[min(1440px,96vw)] gap-6 px-4 pb-14 pt-24 md:px-6">
        <Sidebar
          active={active}
          onSelect={setActive}
          completion={completion}
        />

        <section className="min-w-0 flex-1">
          <EditorShell section={active}>
            {active === "profile" && (
              <ProfileEditor
                value={resume}
                onChange={(patch) => setResume({ ...resume, ...patch })}
              />
            )}
            {active === "experience" && (
              <ExperienceEditor
                items={resume.experience ?? []}
                onChange={(next) => setResume({ ...resume, experience: next })}
              />
            )}
            {active === "skills" && (
              <SkillsEditor
                items={resume.skills ?? []}
                onChange={(next) => setResume({ ...resume, skills: next })}
              />
            )}
            {active === "education" && (
              <EducationEditor
                items={resume.education ?? []}
                onChange={(next) => setResume({ ...resume, education: next })}
              />
            )}
            {active === "review" && (
              <ReviewPanel
                validationResult={validationResult}
                generateResult={generateResult}
                warnings={warnings}
                markdown={markdown}
                isValidating={isValidating}
                isGenerating={isGenerating}
                onValidate={handleValidate}
                onGenerate={handleGenerate}
              />
            )}
          </EditorShell>
        </section>

        <aside className="hidden w-[400px] shrink-0 xl:block">
          <PreviewPanel
            resume={resume}
            validationResult={validationResult}
            warnings={warnings}
          />
        </aside>
      </div>
    </main>
  )
}

/* ──────────────────────────────────────────────────────────────
   Top bar — global actions, API key, validate/generate shortcuts
─────────────────────────────────────────────────────────────── */

function TopBar({
  apiKey,
  setApiKey,
  isValidating,
  isGenerating,
  onValidate,
  onGenerate,
}: {
  apiKey: string
  setApiKey: (v: string) => void
  isValidating: boolean
  isGenerating: boolean
  onValidate: () => void
  onGenerate: () => void
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[min(1440px,96vw)] items-center justify-between gap-5 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-[9px] border border-border-strong bg-surface-3/80 text-accent"
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
            <span className="font-display text-[15px] leading-none text-foreground">
              Kerning
            </span>
          </Link>
          <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground md:inline">
            · builder
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <label
              htmlFor="api-key"
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              API KEY
            </label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="h-9 w-44 rounded-full border border-border bg-surface px-3.5 font-mono text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:border-border-strong focus:outline-none"
              placeholder="X-API-Key"
            />
          </div>

          <button
            type="button"
            onClick={onValidate}
            disabled={isValidating || isGenerating}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-4 text-[12.5px] text-foreground transition-colors hover:border-border-strong disabled:opacity-55"
          >
            {isValidating ? (
              <>
                <Spinner className="h-3.5 w-3.5" /> Validating
              </>
            ) : (
              "Validate"
            )}
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isValidating || isGenerating}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-[12.5px] font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-[1px] disabled:translate-y-0 disabled:opacity-55"
          >
            {isGenerating ? (
              <>
                <Spinner className="h-3.5 w-3.5" /> Generating
              </>
            ) : (
              "Generate resume"
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

/* ──────────────────────────────────────────────────────────────
   Sidebar — sections rail
─────────────────────────────────────────────────────────────── */

function Sidebar({
  active,
  onSelect,
  completion,
}: {
  active: SectionId
  onSelect: (id: SectionId) => void
  completion: Record<SectionId, { filled: number; total: number }>
}) {
  return (
    <nav className="sticky top-24 hidden h-[calc(100vh-7rem)] w-[220px] shrink-0 md:block">
      <div className="panel flex h-full flex-col overflow-hidden p-4">
        <p className="meta px-2">SECTIONS</p>
        <ul className="mt-3 space-y-1">
          {SECTIONS.map((s) => {
            const c = completion[s.id]
            const done = c.filled === c.total && c.total > 0
            const isActive = s.id === active
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "bg-surface-2 text-foreground"
                      : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10.5px] tracking-[0.14em]",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.index}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13.5px] leading-tight">
                      {s.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {s.hint}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                      s.id === "review"
                        ? "bg-accent/70"
                        : done
                          ? "bg-[oklch(0.64_0.12_145)]"
                          : c.filled > 0
                            ? "bg-[oklch(0.76_0.13_78)]"
                            : "bg-border-strong",
                    )}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-auto rounded-[10px] border border-border bg-surface-2/50 p-3">
          <p className="meta">PROGRESS</p>
          <div className="mt-2 flex items-end gap-2">
            <p className="font-display text-2xl leading-none tracking-[-0.01em]">
              {overallProgress(completion)}%
            </p>
            <p className="pb-0.5 meta">COMPLETE</p>
          </div>
          <div className="mt-2 h-1 rounded-full bg-border">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${overallProgress(completion)}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ──────────────────────────────────────────────────────────────
   Editor shell — header + content container
─────────────────────────────────────────────────────────────── */

function EditorShell({
  section,
  children,
}: {
  section: SectionId
  children: React.ReactNode
}) {
  const meta = SECTIONS.find((s) => s.id === section)!
  return (
    <div className="panel-strong relative overflow-hidden p-6 md:p-10">
      <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <p className="meta">§ {meta.index} · {meta.label.toUpperCase()}</p>
          <h1 className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-[1.05] tracking-[-0.018em] text-foreground">
            {editorTitle(section)}
          </h1>
          <p className="mt-3 max-w-xl text-[13.5px] leading-[1.65] text-muted-foreground">
            {editorSubtitle(section)}
          </p>
        </div>
        <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground md:inline">
          {meta.hint}
        </span>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  )
}

function editorTitle(section: SectionId): string {
  switch (section) {
    case "profile":
      return "Tell us who this resume is for."
    case "experience":
      return "The roles that define the story."
    case "skills":
      return "Tools, languages, and systems."
    case "education":
      return "Formal education and training."
    case "review":
      return "Validate, generate, and export."
  }
}

function editorSubtitle(section: SectionId): string {
  switch (section) {
    case "profile":
      return "Basic identity and contact information. All fields are optional except name and email, but a full profile produces a stronger final resume."
    case "experience":
      return "Add each role you want to include. Lead bullets with outcomes and numbers where possible — clear signal matters more than length."
    case "skills":
      return "Keep skills specific and current. Group technical tools first, then platforms and methodologies."
    case "education":
      return "Include formal degrees, certifications, and significant coursework. GPA is optional."
    case "review":
      return "Run validation to surface warnings, then generate the ATS-ready markdown. Export when the output looks right."
  }
}

/* ──────────────────────────────────────────────────────────────
   Profile editor
─────────────────────────────────────────────────────────────── */

function ProfileEditor({
  value,
  onChange,
}: {
  value: ResumeIn
  onChange: (patch: Partial<ResumeIn>) => void
}) {
  const loc = value.location ?? {}
  const setLoc = (patch: Partial<LocationIn>) =>
    onChange({ location: { ...loc, ...patch } })

  return (
    <div className="grid gap-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name">
          <TextInput
            value={value.name}
            onChange={(v) => onChange({ name: v })}
            placeholder="Alex Chen"
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={value.email}
            onChange={(v) => onChange({ email: v })}
            placeholder="you@domain.com"
          />
        </Field>
        <Field label="Phone">
          <TextInput
            value={value.phone}
            onChange={(v) => onChange({ phone: v })}
            placeholder="+1 415 555 0100"
          />
        </Field>
      </div>

      <Divider label="Location" />

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Country">
          <TextInput
            value={loc.country ?? ""}
            onChange={(v) => setLoc({ country: v })}
            placeholder="US"
          />
        </Field>
        <Field label="State / Region">
          <TextInput
            value={loc.state ?? ""}
            onChange={(v) => setLoc({ state: v })}
            placeholder="CA"
          />
        </Field>
        <Field label="City">
          <TextInput
            value={loc.city ?? ""}
            onChange={(v) => setLoc({ city: v })}
            placeholder="San Francisco"
          />
        </Field>
      </div>

      <Divider label="Links" />

      <UrlListEditor
        items={value.urls ?? []}
        onChange={(next) => onChange({ urls: next })}
      />
    </div>
  )
}

function UrlListEditor({
  items,
  onChange,
}: {
  items: string[]
  onChange: (next: string[]) => void
}) {
  const update = (i: number, v: string) =>
    onChange(items.map((x, j) => (j === i ? v : x)))
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const add = () => onChange([...items, ""])

  return (
    <div className="grid gap-3">
      {items.length === 0 && (
        <p className="text-[13px] text-muted-foreground">
          No links yet. Add a portfolio, GitHub, or LinkedIn.
        </p>
      )}
      {items.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={url}
            onChange={(v) => update(i, v)}
            placeholder="https://…"
          />
          <IconButton aria-label="Remove link" onClick={() => remove(i)}>
            ×
          </IconButton>
        </div>
      ))}
      <div>
        <SecondaryButton onClick={add}>+ Add link</SecondaryButton>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Experience editor
─────────────────────────────────────────────────────────────── */

function ExperienceEditor({
  items,
  onChange,
}: {
  items: ExperienceIn[]
  onChange: (next: ExperienceIn[]) => void
}) {
  const update = (i: number, patch: Partial<ExperienceIn>) =>
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const add = () => onChange([...items, emptyExperience()])

  return (
    <div className="grid gap-6">
      {items.length === 0 && (
        <EmptyState
          title="No roles yet"
          body="Add the first role to start building the experience section."
          action={<SecondaryButton onClick={add}>+ Add role</SecondaryButton>}
        />
      )}

      {items.map((exp, i) => (
        <ExperienceCard
          key={i}
          index={i}
          value={exp}
          onChange={(patch) => update(i, patch)}
          onRemove={() => remove(i)}
        />
      ))}

      {items.length > 0 && (
        <div>
          <SecondaryButton onClick={add}>+ Add another role</SecondaryButton>
        </div>
      )}
    </div>
  )
}

function ExperienceCard({
  index,
  value,
  onChange,
  onRemove,
}: {
  index: number
  value: ExperienceIn
  onChange: (patch: Partial<ExperienceIn>) => void
  onRemove: () => void
}) {
  const setPosition = (v: string) => onChange({ position: [v] })
  const setBullet = (i: number, v: string) =>
    onChange({
      description: value.description.map((x, j) => (j === i ? v : x)),
    })
  const removeBullet = (i: number) =>
    onChange({ description: value.description.filter((_, j) => j !== i) })
  const addBullet = () =>
    onChange({ description: [...value.description, ""] })

  return (
    <article className="rounded-[14px] border border-border bg-surface/60 p-5 md:p-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            ROLE · {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-10 bg-border" />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-destructive"
        >
          Remove
        </button>
      </header>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Company">
          <TextInput
            value={value.company}
            onChange={(v) => onChange({ company: v })}
            placeholder="TechCorp Inc."
          />
        </Field>
        <Field label="Position">
          <TextInput
            value={value.position[0] ?? ""}
            onChange={setPosition}
            placeholder="Senior Software Engineer"
          />
        </Field>
        <Field label="Start date">
          <TextInput
            value={value.start_date ?? ""}
            onChange={(v) => onChange({ start_date: v || null })}
            placeholder="2021-03-01"
          />
        </Field>
        <Field
          label="End date"
          hint="Leave blank if current"
        >
          <TextInput
            value={value.end_date ?? ""}
            onChange={(v) => onChange({ end_date: v || null })}
            placeholder="2024-06-01"
          />
        </Field>
        <Field label="Location" className="md:col-span-2">
          <TextInput
            value={value.location}
            onChange={(v) => onChange({ location: v })}
            placeholder="San Francisco, CA"
          />
        </Field>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="meta">HIGHLIGHTS</p>
          <p className="meta text-foreground/80">
            {value.description.length} bullet{value.description.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="mt-3 grid gap-2.5">
          {value.description.map((bullet, i) => (
            <div key={i} className="flex gap-2">
              <span
                aria-hidden
                className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-border-strong"
              />
              <TextArea
                value={bullet}
                onChange={(v) => setBullet(i, v)}
                placeholder="Led migration of 14 services, cutting p99 latency by 41%."
              />
              <IconButton
                aria-label="Remove bullet"
                onClick={() => removeBullet(i)}
              >
                ×
              </IconButton>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <SecondaryButton onClick={addBullet}>+ Add highlight</SecondaryButton>
        </div>
      </div>
    </article>
  )
}

/* ──────────────────────────────────────────────────────────────
   Skills editor — tag style
─────────────────────────────────────────────────────────────── */

function SkillsEditor({
  items,
  onChange,
}: {
  items: string[]
  onChange: (next: string[]) => void
}) {
  const [draft, setDraft] = useState("")

  const add = () => {
    const v = draft.trim()
    if (!v) return
    if (items.includes(v)) {
      setDraft("")
      return
    }
    onChange([...items, v])
    setDraft("")
  }

  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2 rounded-[14px] border border-border bg-surface/60 p-3 md:p-4">
        {items.length === 0 && (
          <p className="px-1 text-[13px] text-muted-foreground">
            Add technical tools, languages, frameworks, and platforms.
          </p>
        )}
        {items.map((skill, i) => (
          <span
            key={skill + i}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] text-foreground"
          >
            {skill}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${skill}`}
              className="inline-grid h-4 w-4 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={setDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault()
              add()
            }
          }}
          placeholder="Type a skill, press Enter"
        />
        <SecondaryButton onClick={add}>Add</SecondaryButton>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Education editor
─────────────────────────────────────────────────────────────── */

function EducationEditor({
  items,
  onChange,
}: {
  items: EducationIn[]
  onChange: (next: EducationIn[]) => void
}) {
  const update = (i: number, patch: Partial<EducationIn>) =>
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const add = () => onChange([...items, emptyEducation()])

  return (
    <div className="grid gap-5">
      {items.length === 0 && (
        <EmptyState
          title="No education yet"
          body="Add a school, degree, or significant training program."
          action={<SecondaryButton onClick={add}>+ Add education</SecondaryButton>}
        />
      )}

      {items.map((ed, i) => (
        <article
          key={i}
          className="rounded-[14px] border border-border bg-surface/60 p-5 md:p-6"
        >
          <header className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              ENTRY · {String(i + 1).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-destructive"
            >
              Remove
            </button>
          </header>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="School">
              <TextInput
                value={ed.school}
                onChange={(v) => update(i, { school: v })}
                placeholder="University of California, Berkeley"
              />
            </Field>
            <Field label="Degree">
              <TextInput
                value={ed.degree}
                onChange={(v) => update(i, { degree: v })}
                placeholder="B.S. Computer Science"
              />
            </Field>
            <Field label="Start date">
              <TextInput
                value={ed.start_date ?? ""}
                onChange={(v) => update(i, { start_date: v || null })}
                placeholder="2012-09-01"
              />
            </Field>
            <Field label="Graduation date">
              <TextInput
                value={ed.graduation_date ?? ""}
                onChange={(v) => update(i, { graduation_date: v || null })}
                placeholder="2016-05-01"
              />
            </Field>
            <Field label="GPA" hint="Optional">
              <TextInput
                value={ed.gpa == null ? "" : String(ed.gpa)}
                onChange={(v) => {
                  const n = v.trim()
                  if (n === "") update(i, { gpa: null })
                  else {
                    const num = Number(n)
                    update(i, { gpa: Number.isFinite(num) ? num : null })
                  }
                }}
                placeholder="3.8"
              />
            </Field>
          </div>
        </article>
      ))}

      {items.length > 0 && (
        <div>
          <SecondaryButton onClick={add}>+ Add another entry</SecondaryButton>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Review panel — validation results + generated output
─────────────────────────────────────────────────────────────── */

function ReviewPanel({
  validationResult,
  generateResult,
  warnings,
  markdown,
  isValidating,
  isGenerating,
  onValidate,
  onGenerate,
}: {
  validationResult: ApiResponse<ResumeOut> | null
  generateResult: ApiResponse<ResumeOut> | null
  warnings: string[] | null
  markdown: string | null
  isValidating: boolean
  isGenerating: boolean
  onValidate: () => void
  onGenerate: () => void
}) {
  const copyMarkdown = () => {
    if (!markdown) return
    navigator.clipboard.writeText(markdown).catch(() => {})
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ActionCard
          title="Validate"
          body="Checks the backend schema, cleans contact fields, and surfaces content warnings."
          action={
            <button
              type="button"
              onClick={onValidate}
              disabled={isValidating || isGenerating}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-[13px] text-foreground transition-colors hover:border-foreground/60 disabled:opacity-55"
            >
              {isValidating ? (
                <>
                  <Spinner className="h-3.5 w-3.5" /> Validating…
                </>
              ) : (
                "Run validation"
              )}
            </button>
          }
        />
        <ActionCard
          title="Generate"
          body="Runs validation then produces ATS-friendly markdown with the AI backend."
          accent
          action={
            <button
              type="button"
              onClick={onGenerate}
              disabled={isValidating || isGenerating}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-[1px] disabled:translate-y-0 disabled:opacity-55"
            >
              {isGenerating ? (
                <>
                  <Spinner className="h-3.5 w-3.5" /> Generating…
                </>
              ) : (
                "Generate markdown"
              )}
            </button>
          }
        />
      </div>

      <div className="rounded-[14px] border border-border bg-surface/60 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <p className="meta">VALIDATION</p>
          <p className="meta">{validationResult ? "REPLY" : "IDLE"}</p>
        </div>
        <div className="mt-4">
          {!validationResult ? (
            <p className="text-[13.5px] text-muted-foreground">
              No validation run yet. Click <strong className="text-foreground">Run validation</strong> to
              check the schema and surface warnings.
            </p>
          ) : validationResult.error ? (
            <StatusBanner tone="err" title="Request failed" body={validationResult.error} />
          ) : warnings && warnings.length > 0 ? (
            <>
              <StatusBanner
                tone="warn"
                title={`Passed with ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`}
                body="The backend accepted the payload; review the notes below before generating."
              />
              <ul className="mt-4 space-y-2">
                {warnings.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-[13px] text-foreground"
                  >
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[oklch(0.76_0.13_78)]" />
                    <span className="leading-[1.55]">{w}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <StatusBanner tone="ok" title="Passed cleanly" body="Validation returned no warnings." />
          )}
        </div>
      </div>

      <div className="rounded-[14px] border border-border bg-surface/60 p-5 md:p-6">
        <div className="flex items-center justify-between">
          <p className="meta">GENERATED MARKDOWN</p>
          {markdown && (
            <button
              type="button"
              onClick={copyMarkdown}
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Copy
            </button>
          )}
        </div>
        <div className="mt-4">
          {!generateResult ? (
            <p className="text-[13.5px] text-muted-foreground">
              Generate output will appear here.
            </p>
          ) : generateResult.error ? (
            <StatusBanner tone="err" title="Generate failed" body={generateResult.error} />
          ) : markdown ? (
            <pre className="scrollbar-hidden max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-[10px] border border-border bg-[oklch(0.995_0.003_85)] p-4 font-mono text-[12.5px] leading-[1.6] text-foreground">
              {markdown}
            </pre>
          ) : (
            <StatusBanner tone="warn" title="No markdown in response" body="The backend did not return generated markdown." />
          )}
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  title,
  body,
  action,
  accent,
}: {
  title: string
  body: string
  action: React.ReactNode
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[14px] border p-5 md:p-6",
        accent
          ? "border-border-strong bg-[linear-gradient(180deg,oklch(0.98_0.01_80)_0%,oklch(0.96_0.02_78)_100%)]"
          : "border-border bg-surface/60",
      )}
    >
      <div>
        <p className="meta">{title.toUpperCase()}</p>
        <h3 className="mt-2 font-display text-[1.3rem] leading-[1.1] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.6] text-muted-foreground">
          {body}
        </p>
      </div>
      <div className="mt-auto">{action}</div>
    </div>
  )
}

function StatusBanner({
  tone,
  title,
  body,
}: {
  tone: "ok" | "warn" | "err"
  title: string
  body: string
}) {
  const dot =
    tone === "ok"
      ? "bg-[oklch(0.64_0.12_145)]"
      : tone === "warn"
        ? "bg-[oklch(0.76_0.13_78)]"
        : "bg-[oklch(0.58_0.18_28)]"
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-border bg-surface px-4 py-3">
      <span className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
      <div>
        <p className="text-[13.5px] font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-[1.55] text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Right-rail preview panel
─────────────────────────────────────────────────────────────── */

function PreviewPanel({
  resume,
  validationResult,
  warnings,
}: {
  resume: ResumeIn
  validationResult: ApiResponse<ResumeOut> | null
  warnings: string[] | null
}) {
  return (
    <div className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col gap-4">
      <div className="panel-strong flex-1 overflow-hidden rounded-[20px]">
        <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-5 py-3">
          <p className="meta">LIVE PREVIEW</p>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
            resume.md
          </span>
        </div>
        <div className="h-[calc(100%-46px)] overflow-auto bg-[oklch(0.995_0.003_85)] p-6">
          <ResumeRender resume={resume} />
        </div>
      </div>

      <div className="panel rounded-[18px] p-4">
        <div className="flex items-center justify-between">
          <p className="meta">STATUS</p>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.16em]",
              validationResult
                ? validationResult.success
                  ? "text-foreground"
                  : "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {validationResult
              ? validationResult.success
                ? warnings && warnings.length > 0
                  ? `${warnings.length} warnings`
                  : "Clean"
                : "Error"
              : "Idle"}
          </span>
        </div>
        <p className="mt-2.5 text-[12.5px] leading-[1.55] text-muted-foreground">
          {validationResult
            ? validationResult.success
              ? warnings && warnings.length > 0
                ? "Validation passed with notes. Check the review panel."
                : "Validation passed without warnings."
              : validationResult.error || "Request failed."
            : "Run validation to surface parser issues and content warnings."}
        </p>
      </div>
    </div>
  )
}

function ResumeRender({ resume }: { resume: ResumeIn }) {
  const loc = resume.location ?? {}
  const locString = [loc.city, loc.state, loc.country].filter(Boolean).join(", ")
  return (
    <article className="text-[oklch(0.2_0.01_55)]">
      <header>
        <h2 className="font-display text-[1.75rem] leading-[1.05] tracking-[-0.012em]">
          {resume.name || "Your name"}
        </h2>
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">
          {[resume.email, resume.phone, locString].filter(Boolean).join(" · ") ||
            "email · phone · location"}
        </p>
        {resume.urls && resume.urls.length > 0 && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {resume.urls.filter(Boolean).join("  ·  ")}
          </p>
        )}
      </header>

      <div className="mt-5 h-px bg-border" />

      {resume.experience && resume.experience.length > 0 && (
        <section className="mt-5">
          <p className="meta">EXPERIENCE</p>
          <div className="mt-3 space-y-4">
            {resume.experience.map((e, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[12.5px] font-medium leading-tight">
                    {(e.position[0] || "Position")}
                    {" · "}
                    {e.company || "Company"}
                  </p>
                  <p className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {dateRange(e.start_date, e.end_date)}
                  </p>
                </div>
                {e.location && (
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    {e.location}
                  </p>
                )}
                {e.description && e.description.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[11.5px] leading-[1.55]">
                    {e.description
                      .filter(Boolean)
                      .map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills && resume.skills.length > 0 && (
        <section className="mt-5">
          <p className="meta">SKILLS</p>
          <p className="mt-2 text-[11.5px] leading-[1.55]">
            {resume.skills.join(" · ")}
          </p>
        </section>
      )}

      {resume.education && resume.education.length > 0 && (
        <section className="mt-5">
          <p className="meta">EDUCATION</p>
          <div className="mt-2.5 space-y-2.5">
            {resume.education.map((ed, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[12.5px] font-medium">
                    {ed.degree || "Degree"}
                    {" · "}
                    {ed.school || "School"}
                  </p>
                  <p className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {dateRange(ed.start_date, ed.graduation_date)}
                  </p>
                </div>
                {ed.gpa != null && (
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                    GPA {ed.gpa}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

function dateRange(start: string | null | undefined, end: string | null | undefined) {
  const s = (start ?? "").slice(0, 7) || "—"
  const e = end ? (end ?? "").slice(0, 7) : "present"
  return `${s} — ${e}`
}

/* ──────────────────────────────────────────────────────────────
   Shared controls
─────────────────────────────────────────────────────────────── */

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={cn("block", className)}>
      <span className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
            {hint}
          </span>
        )}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  onKeyDown,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="block h-11 w-full rounded-[10px] border border-border bg-surface px-3.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/60 focus:border-border-strong focus:outline-none"
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="block min-h-[44px] w-full resize-y rounded-[10px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] leading-[1.55] text-foreground placeholder:text-muted-foreground/60 focus:border-border-strong focus:outline-none"
    />
  )
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-4 text-[12.5px] text-foreground transition-colors hover:border-border-strong"
    >
      {children}
    </button>
  )
}

function IconButton({
  children,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  onClick?: () => void
  "aria-label": string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-border bg-surface text-[16px] leading-none text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
    >
      {children}
    </button>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[14px] border border-dashed border-border-strong bg-surface/50 p-6">
      <div>
        <p className="font-display text-[1.1rem] leading-tight">{title}</p>
        <p className="mt-1.5 text-[13px] leading-[1.6] text-muted-foreground">{body}</p>
      </div>
      {action}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────────── */

function sectionCompletion(r: ResumeIn): Record<SectionId, { filled: number; total: number }> {
  const profileFields = [
    r.name,
    r.email,
    r.phone,
    r.location?.city,
    r.location?.country,
  ]
  const profileFilled = profileFields.filter((v) => Boolean(v)).length

  const expEntries = r.experience ?? []
  const expFilled = expEntries.filter(
    (e) => e.company && e.position[0] && e.description.some(Boolean),
  ).length

  const edEntries = r.education ?? []
  const edFilled = edEntries.filter((e) => e.school && e.degree).length

  const skills = r.skills ?? []

  return {
    profile: { filled: profileFilled, total: profileFields.length },
    experience: {
      filled: expFilled,
      total: Math.max(1, expEntries.length),
    },
    skills: {
      filled: skills.length > 0 ? 1 : 0,
      total: 1,
    },
    education: {
      filled: edFilled,
      total: Math.max(1, edEntries.length),
    },
    review: { filled: 0, total: 0 },
  }
}

function overallProgress(
  completion: Record<SectionId, { filled: number; total: number }>,
): number {
  const sections: SectionId[] = ["profile", "experience", "skills", "education"]
  const score = sections.reduce((acc, s) => {
    const { filled, total } = completion[s]
    return acc + (total === 0 ? 0 : Math.min(1, filled / total))
  }, 0)
  return Math.round((score / sections.length) * 100)
}

function serializeResume(r: ResumeIn): object {
  const cleanUrls = (r.urls ?? []).filter(Boolean)
  const cleanSkills = (r.skills ?? []).filter(Boolean)
  const cleanExp = (r.experience ?? []).map((e) => ({
    ...e,
    position: e.position.filter(Boolean),
    description: e.description.filter(Boolean),
  }))
  const cleanEd = (r.education ?? []).map((e) => ({
    ...e,
    gpa: e.gpa == null || Number.isNaN(e.gpa) ? null : e.gpa,
  }))
  return {
    name: r.name,
    email: r.email,
    phone: r.phone,
    location: r.location ?? {},
    urls: cleanUrls,
    experience: cleanExp,
    skills: cleanSkills,
    education: cleanEd,
  }
}
