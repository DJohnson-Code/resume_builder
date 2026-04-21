"use client"

import { Reveal } from "./reveal"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-border bg-surface/55">
      <div className="mx-auto grid max-w-[min(1380px,94vw)] gap-14 px-6 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <Reveal>
            <p className="meta">FOOTER · KERNING</p>
            <h3 className="mt-6 font-display text-[clamp(2.2rem,4vw,3rem)] leading-[0.98] tracking-[-0.015em]">
              Serious product,
              <br />
              serious output.
            </h3>
            <p className="mt-5 max-w-md text-[14.5px] leading-[1.7] text-muted-foreground">
              Kerning is built for people who want cleaner resumes without
              sacrificing control. Structured input, readable output, and a
              workflow that feels considered all the way through.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 md:col-span-7">
          <FooterColumn
            title="Product"
            links={[
              ["Builder", "/builder"],
              ["Workflow", "#workflow"],
              ["Quality", "#trust"],
              ["Notes", "#faq"],
            ]}
          />
          <FooterColumn
            title="System"
            links={[
              ["Validation", "#features"],
              ["Assist", "#features"],
              ["Generate", "#features"],
              ["ATS", "#trust"],
            ]}
          />
          <FooterColumn
            title="Access"
            links={[
              ["Open builder", "/builder"],
              ["Home", "#top"],
              ["Documentation", "#faq"],
              ["Contact", "mailto:hello@kerning.app"],
            ]}
          />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[min(1380px,94vw)] flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <p className="meta">© {year} Kerning Labs · resume workflows, refined</p>
          <p className="meta flex items-center gap-4">
            <span>STATUS · operational</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.64_0.11_145)]" />
            <span>build 1.08.0</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: Array<[string, string]>
}) {
  return (
    <Reveal delay={1}>
      <p className="meta">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-[14px] text-foreground/85 transition-colors hover:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
