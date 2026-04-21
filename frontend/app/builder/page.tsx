"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  ResultPanel,
  EmptyState,
  JsonDisplay,
  MarkdownPreview,
  ErrorList,
} from "@/components/result-panel"
import {
  validateResume,
  generateResume,
  type ApiResponse,
  type ResumeOut,
} from "@/lib/api"
import { sampleResumeJson } from "@/lib/sample-resume"

export default function BuilderPage() {
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
    <main className="relative min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[min(1380px,94vw)] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-md bg-foreground text-background"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
                <path
                  d="M5 4h7a5 5 0 0 1 0 10H7m0 0h5.5a5 5 0 0 1 0 10H5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="square"
                />
              </svg>
            </span>
            <span className="font-display text-[15px] leading-none tracking-[-0.01em]">
              Kerning
            </span>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              · builder
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              ← HOME
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[min(1380px,94vw)] px-6 pt-28 pb-24">
        <div className="max-w-3xl">
          <p className="meta">§ BUILDER</p>
          <h1 className="mt-5 font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.0] tracking-[-0.018em]">
            Paste. Validate. Generate.
          </h1>
          <p className="mt-5 max-w-xl text-[14.5px] leading-[1.7] text-muted-foreground">
            Drop structured resume JSON on the left. Validation and generation
            run against the backend — the output panel on the right shows the
            live response and the ATS-ready markdown.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-8">
          {/* Left — Input */}
          <div className="space-y-6">
            <Field
              id="json-input"
              label="Resume JSON"
              description="Matches the backend's ResumeIn schema: name, email, phone, experience, skills."
              error={parseError ? `JSON parse error: ${parseError}` : null}
            >
              <div className="panel overflow-hidden">
                <textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="h-[28rem] w-full resize-none bg-transparent px-5 py-4 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
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
                  <span className="inline-flex items-center rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    DEV
                  </span>{" "}
                  Local development only.
                </>
              }
            >
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-11 w-full rounded-full border border-border bg-surface px-5 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:border-border-strong focus:outline-none"
                placeholder="X-API-Key"
              />
            </Field>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button
                onClick={handleValidate}
                disabled={isValidating || isGenerating}
                variant="outline"
                size="lg"
                className="h-11 flex-1 rounded-full border-border-strong bg-surface text-foreground hover:bg-surface-2"
              >
                {isValidating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" /> Validating…
                  </>
                ) : (
                  "Validate"
                )}
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isValidating || isGenerating}
                size="lg"
                className="h-11 flex-1 rounded-full bg-primary text-primary-foreground hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" /> Generating…
                  </>
                ) : (
                  "Generate resume"
                )}
              </Button>
            </div>
          </div>

          {/* Right — Output */}
          <div className="space-y-5">
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
                  <p className="mb-3 text-sm text-foreground">
                    Passed with warnings:
                  </p>
                  <ErrorList errors={validationWarnings} />
                </>
              ) : (
                <p className="text-sm text-foreground">Passed. No warnings.</p>
              )}
            </ResultPanel>

            <ResultPanel title="Raw API response" meta="json">
              {!validationResult && !generateResult ? (
                <EmptyState message="Responses will appear here after a request." />
              ) : (
                <div className="space-y-4">
                  {validationResult && (
                    <div>
                      <p className="mb-1.5 meta">Validation</p>
                      <JsonDisplay data={validationResult} />
                    </div>
                  )}
                  {generateResult && (
                    <div>
                      <p className="mb-1.5 meta">Generate</p>
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
    </main>
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
        <span className="h-px flex-1 bg-border" />
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
