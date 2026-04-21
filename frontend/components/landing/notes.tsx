"use client"

import { Reveal } from "./reveal"

const NOTES: Array<{ q: string; a: string }> = [
  {
    q: "Are suggestions grounded in my own resume?",
    a: "Yes. Kerning works from the material you provide and surfaces changes next to the source they came from. The point is better expression, not fabricated experience.",
  },
  {
    q: "Can I start from an existing resume?",
    a: "Yes. Bring a current PDF, DOCX, or rough draft. The workflow is designed to turn existing material into structured, editable resume data instead of making you start blank.",
  },
  {
    q: "What makes the output ATS-friendly?",
    a: "Clean section structure, parser-safe formatting, readable headings, and stable extracted fields. Kerning optimizes for both machine parsing and human scanning at the same time.",
  },
  {
    q: "Do I keep ownership of the final files?",
    a: "Fully. The final resume stays portable through markdown and structured exports, so you always keep a clean source of truth outside the product.",
  },
]

export function Notes() {
  return (
    <section id="faq" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-[min(1380px,94vw)] px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="meta">§ 05 · QUALITY NOTES</p>
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.0] tracking-[-0.018em]">
                Quality, trust,
                <br />
                written plainly.
              </h2>
              <p className="mt-6 max-w-md text-[14px] leading-[1.7] text-muted-foreground">
                The practical questions serious users ask before they trust a
                resume tool with something important.
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
