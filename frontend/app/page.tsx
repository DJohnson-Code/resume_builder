"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  ResultPanel,
  EmptyState,
  JsonDisplay,
  MarkdownPreview,
  ErrorList,
} from "@/components/result-panel"
import { Marquee } from "@/components/marquee"
import {
  validateResume,
  generateResume,
  type ApiResponse,
  type ResumeOut,
} from "@/lib/api"
import { sampleResumeJson } from "@/lib/sample-resume"

export default function Home() {
  const [jsonInput, setJsonInput] = useState(sampleResumeJson)
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const [validationResult, setValidationResult] =
    useState<ApiResponse<ResumeOut> | null>(null)
  const [generateResult, setGenerateResult] =
    useState<ApiResponse<ResumeOut> | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)

  const parseJson = (): object | null => {
    try {
      const parsed = JSON.parse(jsonInput)
      setParseError(null)
      return parsed
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Invalid JSON")
      return null
    }
  }

  const handleValidate = async () => {
    const parsed = parseJson()
    if (!parsed) return
    setIsValidating(true)
    setValidationResult(null)
    const result = await validateResume(parsed, apiKey)
    setValidationResult(result)
    setIsValidating(false)
  }

  const handleGenerate = async () => {
    const parsed = parseJson()
    if (!parsed) return
    setIsGenerating(true)
    setGenerateResult(null)
    const result = await generateResume(parsed, apiKey)
    setGenerateResult(result)
    setIsGenerating(false)
  }

  const markdownContent =
    generateResult?.success && generateResult.data
      ? generateResult.data.ai_resume_markdown
      : null

  const validationWarnings =
    validationResult?.success && validationResult.data
      ? validationResult.data.warnings
      : null

  return (
    <div className="grain relative min-h-screen">
      {/* ────────────────────────────────────────────────────────
          NAV
      ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-serif text-[17px] tracking-tight text-foreground">
              Résumé<span className="italic text-accent">/</span>Builder
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              v1
            </span>
          </a>
          <nav className="hidden items-center gap-9 text-xs tracking-wide text-muted-foreground md:flex">
            <a href="#builder" className="transition-colors hover:text-foreground">
              Builder
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a
              href="https://github.com"
              className="transition-colors hover:text-foreground"
            >
              Docs
            </a>
          </nav>
          <a
            href="#builder"
            className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open builder
          </a>
        </div>
      </header>

      {/* ────────────────────────────────────────────────────────
          HERO
      ──────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative mx-auto max-w-6xl px-6 pt-24 pb-28 lg:px-8 lg:pt-32 lg:pb-36"
      >
        {/* Decorative rose glint */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-[-10%] -z-10 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-8%] bottom-[-20%] -z-10 h-[420px] w-[420px] rounded-full bg-highlight/15 blur-[150px]"
        />

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <span className="h-px w-10 bg-accent/60" />
          <span className="font-mono">
            For developers, new grads &amp; engineers in motion
          </span>
        </div>

        <h1 className="mt-9 max-w-5xl text-[15vw] font-semibold leading-[0.92] tracking-[-0.035em] text-foreground sm:text-7xl lg:text-[7.5rem]">
          The résumé,{" "}
          <span className="font-serif font-normal italic text-foreground/90">
            rewritten.
          </span>
        </h1>

        <p className="mt-9 max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
          Paste your career as structured JSON. We validate it against a strict
          schema and publish an ATS-ready markdown résumé in seconds. Built for
          people who'd rather ship than format.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#builder"
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open the builder
          </a>
          <a
            href="#how"
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-border/80 px-5 text-sm text-foreground/90 transition-colors hover:bg-secondary"
          >
            How it works
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>

        {/* Scroll cue */}
        <div className="mt-24 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
          <span className="pulse-soft">↓</span>
          <span className="font-mono">Scroll</span>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          MARQUEE
      ──────────────────────────────────────────────────────── */}
      <Marquee
        items={[
          "ATS-tuned",
          "Structured schema",
          "Markdown-native",
          "Validated live",
          "Zero lock-in",
          "Built for developers",
          "Powered by GPT",
          "Ship your story",
        ]}
      />

      {/* ────────────────────────────────────────────────────────
          BUILDER — centerpiece, functional
      ──────────────────────────────────────────────────────── */}
      <section
        id="builder"
        className="relative mx-auto max-w-6xl scroll-mt-24 px-6 pt-24 pb-16 lg:px-8 lg:pt-32"
      >
        <SectionIntro
          index="01"
          eyebrow="The builder"
          title={
            <>
              Paste, validate,{" "}
              <span className="font-serif italic text-muted-foreground/90">
                generate.
              </span>
            </>
          }
          description="Drop a resume payload on the left. The right column streams validation, the raw API response, and the generated markdown as you work."
        />

        <div className="mt-14 grid gap-14 lg:grid-cols-5 lg:gap-12">
          {/* Left — Input */}
          <div className="space-y-7 lg:col-span-3">
            <Field
              id="json-input"
              label="Resume JSON"
              description="Paste data matching the backend's ResumeIn schema — name, email, phone, experience, skills. Sent as-is to the API."
              error={parseError ? `JSON parse error: ${parseError}` : null}
            >
              <div className="ring-gradient relative rounded-xl bg-card/40 backdrop-blur-sm">
                <textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="relative h-[28rem] w-full resize-none rounded-xl bg-transparent px-5 py-4 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                  placeholder="Paste your resume JSON here…"
                  spellCheck={false}
                />
              </div>
            </Field>

            <Field
              id="api-key"
              label="API key"
              description={
                <>
                  <span className="inline-flex items-center rounded-md border border-border/80 bg-secondary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Dev
                  </span>{" "}
                  Local development only. Do not ship with production credentials.
                </>
              }
            >
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-11 w-full rounded-full border border-border/80 bg-input/60 px-5 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                placeholder="X-API-Key"
              />
            </Field>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                onClick={handleValidate}
                disabled={isValidating || isGenerating}
                variant="outline"
                size="lg"
                className="h-11 flex-1 rounded-full border-border/80 bg-transparent text-foreground hover:bg-secondary hover:text-foreground"
              >
                {isValidating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Validating…
                  </>
                ) : (
                  "Validate"
                )}
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isValidating || isGenerating}
                size="lg"
                className="h-11 flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generating…
                  </>
                ) : (
                  "Generate résumé"
                )}
              </Button>
            </div>
          </div>

          {/* Right — Output */}
          <div className="space-y-5 lg:col-span-2">
            <ResultPanel
              title="Validation"
              meta="POST /validate"
              variant={
                validationResult
                  ? validationResult.success
                    ? "success"
                    : "error"
                  : "default"
              }
            >
              {!validationResult ? (
                <EmptyState message="Run Validate to check the JSON against the backend schema." />
              ) : validationResult.error ? (
                <p className="text-sm leading-relaxed text-destructive">
                  {validationResult.error}
                </p>
              ) : validationWarnings && validationWarnings.length > 0 ? (
                <>
                  <p className="mb-3 text-sm text-accent">
                    Passed with warnings:
                  </p>
                  <ErrorList errors={validationWarnings} />
                </>
              ) : (
                <p className="text-sm text-accent">Passed. No warnings.</p>
              )}
            </ResultPanel>

            <ResultPanel title="Raw API response" meta="json">
              {!validationResult && !generateResult ? (
                <EmptyState message="Responses will appear here after a request." />
              ) : (
                <div className="space-y-4">
                  {validationResult && (
                    <div>
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                        Validation
                      </p>
                      <JsonDisplay data={validationResult} />
                    </div>
                  )}
                  {generateResult && (
                    <div>
                      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                        Generate
                      </p>
                      <JsonDisplay data={generateResult} />
                    </div>
                  )}
                </div>
              )}
            </ResultPanel>

            <ResultPanel
              title="Generated markdown"
              meta="POST /generate"
              variant={markdownContent ? "success" : "default"}
            >
              {!generateResult ? (
                <EmptyState message="Generated markdown will appear here after Generate runs." />
              ) : generateResult.error ? (
                <p className="text-sm leading-relaxed text-destructive">
                  {generateResult.error}
                </p>
              ) : markdownContent ? (
                <MarkdownPreview content={markdownContent} />
              ) : (
                <EmptyState message="No markdown content in the response." />
              )}
            </ResultPanel>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          HOW IT WORKS
      ──────────────────────────────────────────────────────── */}
      <section
        id="how"
        className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 lg:px-8"
      >
        <SectionIntro
          index="02"
          eyebrow="How it works"
          title={
            <>
              Three steps,{" "}
              <span className="font-serif italic text-muted-foreground/90">
                no ceremony.
              </span>
            </>
          }
          description="Designed for engineers who'd rather git commit than drag text boxes. A minimal pipeline from JSON to publish-ready markdown."
        />

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          <Step
            index="01"
            title="Paste your JSON"
            body="Start from our sample payload or bring your own. Each field maps one-to-one to the ResumeIn schema — no translation layer, no hidden magic."
          />
          <Step
            index="02"
            title="Validate live"
            body="POST /validate returns structural warnings and parse failures in real time. Fix your data before it hits the generator."
          />
          <Step
            index="03"
            title="Generate & ship"
            body="POST /generate runs the payload through an ATS-tuned prompt and returns markdown you can paste into any renderer or version-control."
          />
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          CLOSING CTA
      ──────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pb-28 lg:px-8">
        <div className="ring-gradient relative overflow-hidden rounded-3xl bg-card/40 px-8 py-16 backdrop-blur-md md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-highlight/20 blur-[120px]"
          />
          <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="h-px w-10 bg-accent/60" />
            <span className="font-mono">Ready when you are</span>
          </p>
          <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground md:text-5xl lg:text-6xl">
            Stop formatting.{" "}
            <span className="font-serif italic text-foreground/90">
              Start shipping.
            </span>
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#builder"
              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open the builder
            </a>
            <a
              href="#how"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Read the docs →
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FOOTER
      ──────────────────────────────────────────────────────── */}
      <footer className="relative border-t border-border/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 lg:px-8">
          <Stat value="FastAPI" label="backend" />
          <Stat value="GPT" label="generation engine" />
          <Stat value="ATS" label="optimized output" />
          <Stat value="v1" label="api surface" />
        </div>
        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-6 py-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70 md:flex-row md:items-center md:justify-between lg:px-8">
            <span className="font-mono">
              Résumé Builder · crafted for the terminal generation
            </span>
            <span className="font-mono">127.0.0.1:8000 → 3000</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ────────────────────────────────────────────────────────
   Shared local bits
──────────────────────────────────────────────────────── */

function SectionIntro({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string
  eyebrow: string
  title: React.ReactNode
  description: string
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        <span className="font-mono text-muted-foreground/60">{index}</span>
        <span className="h-px w-8 bg-muted-foreground/40" />
        <span className="font-mono">{eyebrow}</span>
      </div>
      <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground md:text-5xl lg:text-[3.5rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

function Step({
  index,
  title,
  body,
}: {
  index: string
  title: string
  body: string
}) {
  return (
    <div className="ring-gradient group relative overflow-hidden rounded-2xl bg-card/40 p-7 backdrop-blur-md transition-colors hover:bg-card/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />
      <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="text-accent">{index}</span>
        <span className="h-px flex-1 bg-border/80" />
      </div>
      <h3 className="mt-8 font-serif text-3xl leading-tight tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-5 text-sm leading-[1.7] text-muted-foreground">{body}</p>
    </div>
  )
}

function Field({
  id,
  label,
  description,
  error,
  children,
}: {
  id: string
  label: string
  description?: React.ReactNode
  error?: string | null
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-3 flex items-center gap-3 text-sm font-medium text-foreground"
      >
        <span>{label}</span>
        <span className="h-px flex-1 bg-border/60" />
      </label>
      {children}
      {description && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs leading-relaxed text-destructive">{error}</p>
      )}
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
        {label}
      </div>
    </div>
  )
}
