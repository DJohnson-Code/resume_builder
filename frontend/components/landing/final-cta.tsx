"use client"

import { Reveal } from "./reveal"

export function FinalCta() {
  return (
    <section className="relative pb-28 pt-10 md:pb-36">
      <div className="mx-auto max-w-[min(1380px,94vw)] px-6">
        <Reveal variant="scale">
          <div className="panel-strong relative overflow-hidden rounded-[28px] px-8 py-16 md:px-16 md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,oklch(0.74_0.08_65/0.24),transparent_60%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(180deg,transparent,oklch(0.16_0.014_255/0.6))]"
            />

            <p className="meta">§ 05 · START</p>
            <h2 className="mt-6 max-w-[18ch] font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.96] tracking-[-0.018em] text-foreground">
              Build a cleaner resume before the next application goes
              <span className="font-accent ml-3 inline-block text-accent">
                out.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-muted-foreground">
              Start with the material you already have. Kerning helps you
              organize it, validate it, improve it, and ship a version that is
              ready for recruiters and ATS systems alike.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="/builder"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[14px] font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-[2px]"
              >
                Open the builder
                <span aria-hidden>→</span>
              </a>
              <a
                href="#workflow"
                className="inline-flex h-12 items-center rounded-full border border-border-strong bg-surface px-5 text-[14px] text-foreground transition-colors hover:border-foreground/60"
              >
                Tour the workflow
              </a>
              <span className="meta ml-2">PRIVATE BETA · BUILT FOR LIVE USE</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
