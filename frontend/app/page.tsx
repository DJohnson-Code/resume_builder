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
import { validateResume, generateResume, type ApiResponse, type ResumeOut } from "@/lib/api"
import { sampleResumeJson } from "@/lib/sample-resume"

export default function Home() {
  const [jsonInput, setJsonInput] = useState(sampleResumeJson)
  const [apiKey, setApiKey] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const [validationResult, setValidationResult] = useState<ApiResponse<ResumeOut> | null>(null)
  const [generateResult, setGenerateResult] = useState<ApiResponse<ResumeOut> | null>(null)
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

  // Extract markdown from generate result if present
  const markdownContent =
    generateResult?.success && generateResult.data
      ? generateResult.data.ai_resume_markdown
      : null

  // Extract warnings from validation result if present
  const validationWarnings =
    validationResult?.success && validationResult.data
      ? validationResult.data.warnings
      : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Resume Builder
          </h1>
          <span className="ml-2 text-xs text-muted-foreground tracking-wide">
            TM
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* JSON Input */}
            <div>
              <label
                htmlFor="json-input"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Resume JSON
              </label>
              <textarea
                id="json-input"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="h-96 w-full resize-none rounded-lg border border-border bg-input p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Paste your resume JSON here..."
                spellCheck={false}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Paste resume data matching the backend&apos;s ResumeIn schema
                (name, email, phone, experience, skills, etc.). It will be
                sent to the API for validation and generation.
              </p>
              {parseError && (
                <p className="mt-2 text-sm text-destructive">
                  JSON Parse Error: {parseError}
                </p>
              )}
            </div>

            {/* API Key Input */}
            <div>
              <label
                htmlFor="api-key"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-4 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your X-API-Key..."
              />
              <p className="mt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  DEV
                </span>{" "}
                For local development only. Do not use in production.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleValidate}
                disabled={isValidating || isGenerating}
                variant="outline"
                className="flex-1 border-border bg-secondary text-foreground hover:bg-muted hover:text-foreground"
              >
                {isValidating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Validating...
                  </>
                ) : (
                  "Validate"
                )}
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isValidating || isGenerating}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Validation Errors Panel */}
            <ResultPanel
              title="Validation"
              variant={
                validationResult
                  ? validationResult.success
                    ? "success"
                    : "error"
                  : "default"
              }
            >
              {!validationResult ? (
                <EmptyState message="No validation results yet. Click Validate to check your JSON." />
              ) : validationResult.error ? (
                <p className="text-sm text-destructive">{validationResult.error}</p>
              ) : validationWarnings && validationWarnings.length > 0 ? (
                <>
                  <p className="mb-2 text-sm text-primary">Validation passed with warnings:</p>
                  <ErrorList errors={validationWarnings} />
                </>
              ) : (
                <p className="text-sm text-primary">
                  Validation passed. No warnings.
                </p>
              )}
            </ResultPanel>

            {/* Raw API Response Panel */}
            <ResultPanel title="Raw API Response">
              {!validationResult && !generateResult ? (
                <EmptyState message="API responses will appear here after making a request." />
              ) : (
                <div className="space-y-4">
                  {validationResult && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        Validation Response:
                      </p>
                      <JsonDisplay data={validationResult} />
                    </div>
                  )}
                  {generateResult && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        Generate Response:
                      </p>
                      <JsonDisplay data={generateResult} />
                    </div>
                  )}
                </div>
              )}
            </ResultPanel>

            {/* Markdown Preview Panel */}
            <ResultPanel
              title="Generated Markdown"
              variant={markdownContent ? "success" : "default"}
            >
              {!generateResult ? (
                <EmptyState message="Generated markdown will appear here after clicking Generate." />
              ) : generateResult.error ? (
                <p className="text-sm text-destructive">{generateResult.error}</p>
              ) : markdownContent ? (
                <MarkdownPreview content={markdownContent} />
              ) : (
                <EmptyState message="No markdown content in the response." />
              )}
            </ResultPanel>
          </div>
        </div>
      </main>
    </div>
  )
}
