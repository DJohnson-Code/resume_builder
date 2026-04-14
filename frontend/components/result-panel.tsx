"use client"

import { cn } from "@/lib/utils"

interface ResultPanelProps {
  title: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "error" | "success"
  meta?: string
}

export function ResultPanel({
  title,
  children,
  className,
  variant = "default",
  meta,
}: ResultPanelProps) {
  return (
    <div
      className={cn(
        "ring-gradient relative overflow-hidden rounded-2xl bg-card/60 p-5 backdrop-blur-md transition-colors",
        variant === "error" && "bg-destructive/[0.04]",
        variant === "success" && "bg-accent/[0.04]",
        className,
      )}
    >
      {/* Top edge highlight line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />
      <div className="relative mb-4 flex items-baseline justify-between gap-3">
        <h3
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.22em]",
            variant === "default" && "text-muted-foreground",
            variant === "error" && "text-destructive",
            variant === "success" && "text-accent",
          )}
        >
          {title}
        </h3>
        {meta && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {meta}
          </span>
        )}
      </div>
      <div className="relative">{children}</div>
    </div>
  )
}

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex min-h-[72px] items-center rounded-lg border border-dashed border-border/60 bg-background/30 px-4 py-3">
      <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
    </div>
  )
}

interface JsonDisplayProps {
  data: unknown
}

export function JsonDisplay({ data }: JsonDisplayProps) {
  return (
    <pre className="max-h-64 overflow-auto rounded-lg border border-border/60 bg-background/70 p-3.5 text-xs leading-relaxed text-foreground/90 font-mono">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-border/60 bg-background/70 p-4 text-sm leading-relaxed text-foreground/90 font-mono">
      {content}
    </pre>
  )
}

interface ErrorListProps {
  errors: string[]
}

export function ErrorList({ errors }: ErrorListProps) {
  return (
    <ul className="space-y-1.5">
      {errors.map((error, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-sm text-destructive/90"
        >
          <span
            aria-hidden
            className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-destructive"
          />
          <span>{error}</span>
        </li>
      ))}
    </ul>
  )
}
