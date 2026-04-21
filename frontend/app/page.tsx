import { SiteNav } from "@/components/landing/site-nav"
import { Hero } from "@/components/landing/hero"
import { Workflow } from "@/components/landing/workflow"
import { Features } from "@/components/landing/features"
import { Trust } from "@/components/landing/trust"
import { Notes } from "@/components/landing/notes"
import { FinalCta } from "@/components/landing/final-cta"
import { SiteFooter } from "@/components/landing/site-footer"

export default function Home() {
  return (
    <main className="relative">
      <SiteNav />
      <Hero />
      <Workflow />
      <Features />
      <Trust />
      <Notes />
      <FinalCta />
      <SiteFooter />
    </main>
  )
}
