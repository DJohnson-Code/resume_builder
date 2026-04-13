"use client"

import { cn } from "@/lib/utils"

interface ResultPanelProps {
  title: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "error" | "success"
}

export function ResultPanel({
  title,
  children,
  className,
  variant = "default",
}: ResultPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4",
        variant === "error" && "border-destructive/50",
        variant === "success" && "border-primary/50",
        className
      )}
    >
      <h3
        className={cn(
          "mb-3 text-sm font-medium uppercase tracking-wider",
          variant === "default" && "text-muted-foreground",
          variant === "error" && "text-destructive",
          variant === "success" && "text-primary"
        )}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="text-sm text-muted-foreground italic">{message}</p>
  )
}

interface JsonDisplayProps {
  data: unknown
}

export function JsonDisplay({ data }: JsonDisplayProps) {
  return (
    <pre className="max-h-64 overflow-auto rounded bg-secondary p-3 text-xs text-foreground font-mono">
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded bg-secondary p-3 text-sm text-foreground font-mono leading-relaxed">
      {content}
    </pre>
  )
}

interface ErrorListProps {
  errors: string[]
}

export function ErrorList({ errors }: ErrorListProps) {
  return (
    <ul className="space-y-1">
      {errors.map((error, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-destructive">
          <span className="mt-0.5 text-destructive">•</span>
          <span>{error}</span>
        </li>
      ))}
    </ul>
  )
}
