"use client"

import { Reveal } from "./reveal"

const NOTES: Array<{ q: string; a: string }> = [
  {
    q: "Is my content ever used to train a model?",
    a: "No. Your resume content stays on your account and is never mixed into training data. Review runs on your material only, in session.",
  },
  {
    q: "Can I bring an existing resume?",
    a: "Yes. Drop a PDF or DOCX and Kerning will pull it into the structured editor with its sections intact, so you can continue from where you left off.",
  },
  {
    q: "Which ATS systems is it tuned for?",
    a: "Greenhouse, Lever, Workday, iCIMS, and Ashby cover most roles. Output is validated against the same parsing rules those systems use, not a marketing claim.",
  },
  {
    q: "Do I own my files?",
    a: "Fully. Markdown and JSON export gives you a portable source of truth — take your resume anywhere, anytime, with no migration.",
  },
]

export function Notes() {
  return (
    <section id="faq" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[min(1380px,94vw)] px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="meta">§ 05 · NOTES</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.0] tracking-[-0.018em]">
                Fine print,
                <br />
                written plainly.
              </h2>
              <p className="mt-6 max-w-md text-[14px] leading-[1.7] text-muted-foreground">
                The answers we give when people ask. No legalese, no dodging.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <ul className="divide-y divide-border border-y border-border">
              {NOTES.map((n, i) => (
                <Reveal as="li" key={n.q} delay={(i % 4) as 0 | 1 | 2 | 3}>
                  <details className="group peer">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 transition-colors hover:text-foreground">
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                          0{i + 1}
                        </span>
                        <span className="font-display text-[1.2rem] leading-tight tracking-[-0.01em] text-foreground md:text-[1.35rem]">
                          {n.q}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface text-foreground transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-xl pb-7 pl-[52px] text-[14px] leading-[1.7] text-muted-foreground">
                      {n.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
