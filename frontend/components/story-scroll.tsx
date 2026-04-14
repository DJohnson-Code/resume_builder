"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface StoryCard {
  index: string
  eyebrow: string
  title: string
  body: string
  snippet?: {
    lang?: string
    code: string
  }
}

const CARDS: StoryCard[] = [
  {
    index: "01",
    eyebrow: "The problem",
    title: "Most resumes rot in ATS filters.",
    body: "Recruiters skim in 60 seconds. Parsers scan in six. A PDF glued together in a word processor rarely survives either — dropped fields, broken dates, unreadable tables.",
  },
  {
    index: "02",
    eyebrow: "Paste",
    title: "Bring your career as structured JSON.",
    body: "Start from the sample or drop in your own payload. Every field maps one-to-one to the backend's ResumeIn schema — no translation layer, no hidden magic.",
    snippet: {
      lang: "json",
      code: `{
  "name": "Jane Developer",
  "email": "jane@dev.io",
  "phone": "+1-555-0100",
  "experience": [
    {
      "company": "Acme",
      "role": "Senior Engineer",
      "start": "2022-01",
      "end": "present",
      "highlights": [
        "Led migration to event-driven services"
      ]
    }
  ],
  "skills": ["Python", "Go", "Postgres"]
}`,
    },
  },
  {
    index: "03",
    eyebrow: "Validate",
    title: "Catch issues before they ship.",
    body: "POST /validate runs your payload through the schema and flags ambiguity, missing fields, and parse errors — so you fix data, not formatting.",
    snippet: {
      lang: "json",
      code: `{
  "success": true,
  "data": {
    "warnings": [
      "experience[0].highlights is short",
      "skills missing soft-skill category",
      "phone format not E.164"
    ]
  }
}`,
    },
  },
  {
    index: "04",
    eyebrow: "Clean",
    title: "Normalized, deduped, schema-true.",
    body: "Whitespace, case, date formats, and duplicate skills all get flattened to a canonical shape. What you send is what the generator sees.",
    snippet: {
      lang: "diff",
      code: `- "role":  "  senior engineer "
+ "role": "Senior Engineer"
- "start": "Jan 2022"
+ "start": "2022-01"
- "skills": ["Python", "python", "PYTHON"]
+ "skills": ["Python"]`,
    },
  },
  {
    index: "05",
    eyebrow: "Publish",
    title: "ATS-ready markdown, ready to ship.",
    body: "POST /generate runs the cleaned payload through an ATS-tuned prompt and returns portable markdown — paste it into any renderer or commit it next to your code.",
    snippet: {
      lang: "md",
      code: `# Jane Developer
jane@dev.io · +1 555 0100

## Experience
### Senior Engineer — Acme
2022-01 → present
- Led migration to event-driven services
- Reduced p99 latency 40% across core API

## Skills
Python · Go · Postgres`,
    },
  },
]

export function StoryScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const [stickyMode, setStickyMode] = useState(false)
  const [wrapperHeight, setWrapperHeight] = useState<string>("auto")
  const [progress, setProgress] = useState(0)

  // Decide mode: sticky scroll-jack on desktop with motion allowed, native scroll otherwise.
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    )
    const update = () => setStickyMode(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // Measure horizontal distance and set outer wrapper height accordingly.
  // Wrapper height = viewport + horizontal distance, capped so we don't trap.
  useEffect(() => {
    if (!stickyMode) {
      setWrapperHeight("auto")
      return
    }
    const measure = () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return
      const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth)
      const vh = window.innerHeight
      // Cap the vertical budget at 1.3 screen-heights so we don't over-trap.
      const budget = Math.min(maxX, Math.round(vh * 1.3))
      setWrapperHeight(`${vh + budget}px`)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [stickyMode])

  // Drive the track transform from page scroll position. rAF-throttled.
  useEffect(() => {
    if (!stickyMode) {
      const track = trackRef.current
      if (track) track.style.transform = ""
      setProgress(0)
      return
    }
    const wrapper = wrapperRef.current
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!wrapper || !track || !viewport) return

    let rafId: number | null = null
    const apply = () => {
      rafId = null
      const rect = wrapper.getBoundingClientRect()
      const scrollable = wrapper.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const raw = -rect.top
      const p = Math.max(0, Math.min(1, raw / scrollable))
      const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth)
      track.style.transform = `translate3d(${-p * maxX}px, 0, 0)`
      setProgress(p)
    }
    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [stickyMode, wrapperHeight])

  // Edge state for prev/next + fade masks, derived from progress (sticky) or native scroll (fallback).
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    if (stickyMode) {
      setAtStart(progress <= 0.001)
      setAtEnd(progress >= 0.999)
      return
    }
    // Fallback mode: derive edges from native scroll of the track element.
    const el = trackRef.current
    if (!el) return
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      setAtStart(scrollLeft <= 4)
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4)
    }
    update()
    el.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      el.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [stickyMode, progress])

  const handlePrevNext = useCallback(
    (direction: 1 | -1) => {
      if (stickyMode) {
        const wrapper = wrapperRef.current
        const track = trackRef.current
        const viewport = viewportRef.current
        if (!wrapper || !track || !viewport) return
        // One card step in horizontal pixels → equivalent vertical scroll.
        const card = track.querySelector<HTMLElement>("[data-story-card]")
        const cardStepX = card
          ? card.offsetWidth + 24 // gap-6 = 24px
          : 420
        const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth)
        if (maxX <= 0) return
        const scrollable = wrapper.offsetHeight - window.innerHeight
        const verticalStep = (cardStepX / maxX) * scrollable
        window.scrollBy({ top: direction * verticalStep, behavior: "smooth" })
        return
      }
      const el = trackRef.current
      if (!el) return
      const card = el.querySelector<HTMLElement>("[data-story-card]")
      const step = card?.offsetWidth ? card.offsetWidth + 24 : el.clientWidth * 0.8
      el.scrollBy({ left: direction * step, behavior: "smooth" })
    },
    [stickyMode],
  )

  return (
    <section
      aria-label="How the builder works"
      className="relative py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <span className="font-mono text-muted-foreground/60">00</span>
              <span className="h-px w-8 bg-muted-foreground/40" />
              <span className="font-mono">The story</span>
            </div>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground md:text-4xl lg:text-[2.75rem]">
              From messy PDF to{" "}
              <span className="font-serif italic text-muted-foreground/90">
                shippable markdown.
              </span>
            </h2>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground/70">
              <span className="text-accent">→</span>{" "}
              {stickyMode
                ? "Scroll to advance · arrow buttons if you prefer"
                : "Swipe or use the arrow buttons"}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <ScrollButton
              direction="prev"
              disabled={atStart}
              onClick={() => handlePrevNext(-1)}
            />
            <ScrollButton
              direction="next"
              disabled={atEnd}
              onClick={() => handlePrevNext(1)}
            />
          </div>
        </div>
      </div>

      {/* ── STICKY MODE ───────────────────────────────────────── */}
      {stickyMode ? (
        <div
          ref={wrapperRef}
          style={{ height: wrapperHeight }}
          className="relative mt-10"
        >
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
            <div ref={viewportRef} className="relative w-full">
              {/* Edge gradient masks */}
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background via-background/80 to-transparent transition-opacity",
                  atStart && "opacity-0",
                )}
              />
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background via-background/80 to-transparent transition-opacity",
                  atEnd && "opacity-0",
                )}
              />

              <div
                ref={trackRef}
                className="flex gap-6 will-change-transform pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pr-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
              >
                {CARDS.map((card) => (
                  <StoryCardItem key={card.index} card={card} />
                ))}
              </div>

              {/* Progress indicator — premium detail */}
              <div className="mx-auto mt-10 flex max-w-6xl items-center gap-3 px-6 lg:px-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  {String(Math.round(progress * (CARDS.length - 1)) + 1).padStart(
                    2,
                    "0",
                  )}{" "}
                  / {String(CARDS.length).padStart(2, "0")}
                </span>
                <div className="relative h-px flex-1 bg-border/60">
                  <div
                    className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-75 ease-out"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── FALLBACK (mobile / reduced motion): native horizontal scroll ── */
        <div className="relative mt-10">
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background via-background/80 to-transparent transition-opacity",
              atStart && "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background via-background/80 to-transparent transition-opacity",
              atEnd && "opacity-0",
            )}
          />
          <div
            ref={trackRef}
            role="region"
            aria-label="Product story, scroll horizontally"
            tabIndex={0}
            className="scrollbar-hidden flex snap-x snap-mandatory gap-6 overflow-x-scroll overflow-y-hidden pb-6 pt-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <div
              aria-hidden
              className="shrink-0 basis-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:basis-[max(2rem,calc((100vw-72rem)/2+2rem))]"
            />
            {CARDS.map((card) => (
              <StoryCardItem key={card.index} card={card} />
            ))}
            <div aria-hidden className="shrink-0 basis-16 lg:basis-24" />
          </div>
        </div>
      )}
    </section>
  )
}

function StoryCardItem({ card }: { card: StoryCard }) {
  return (
    <article
      data-story-card
      tabIndex={0}
      className="ring-gradient group relative flex w-[85vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-card/70 p-7 backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:w-[28rem] md:w-[30rem] lg:w-[32rem]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />

      <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="text-accent">{card.index}</span>
        <span className="h-px flex-1 bg-border/80" />
        <span>{card.eyebrow}</span>
      </div>

      <h3 className="mt-7 font-serif text-[1.65rem] leading-[1.1] tracking-tight text-foreground">
        {card.title}
      </h3>

      <p className="mt-4 text-sm leading-[1.7] text-muted-foreground">
        {card.body}
      </p>

      {card.snippet && (
        <div className="mt-6 flex-1">
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            <span>{card.snippet.lang ?? "snippet"}</span>
            <span className="mx-3 h-px flex-1 bg-border/60" />
            <span>sample</span>
          </div>
          <pre className="scrollbar-hidden max-h-64 overflow-auto rounded-lg border border-border/60 bg-background/70 p-3.5 text-[11.5px] leading-[1.6] text-foreground/85 font-mono">
            {card.snippet.code}
          </pre>
        </div>
      )}
    </article>
  )
}

function ScrollButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next"
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous card" : "Next card"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/40 text-foreground/80 backdrop-blur-sm transition-all",
        "hover:border-accent/50 hover:bg-card/80 hover:text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border/80 disabled:hover:bg-card/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
      )}
    >
      <span aria-hidden className="text-[15px]">
        {direction === "prev" ? "←" : "→"}
      </span>
    </button>
  )
}
