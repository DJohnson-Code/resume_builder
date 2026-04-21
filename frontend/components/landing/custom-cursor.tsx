"use client"

import { useEffect, useRef, useState } from "react"

/**
 * CustomCursor — a precision dot plus a [Build] pill in Fugaz One that
 * trails the pointer. The pill grows on interactive elements so hover
 * states feel tactile without noise. Disabled on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const pillRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const fine = window.matchMedia("(pointer: fine)")
    if (!fine.matches) return

    document.documentElement.classList.add("has-custom-cursor")
    setMounted(true)

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const tick = () => {
      // Pill eases with a spring-like lag; dot snaps for precision.
      tx += (x - tx) * 0.22
      ty += (y - ty) * 0.22
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`
      }
      if (pillRef.current) {
        pillRef.current.style.left = `${tx}px`
        pillRef.current.style.top = `${ty}px`
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (pillRef.current && !pillRef.current.classList.contains("is-visible")) {
        pillRef.current.classList.add("is-visible")
      }
    }

    const interactiveSelector =
      'a, button, [role="button"], [data-cursor="build"], input, textarea, select, summary, label[for]'

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (!target || !pillRef.current) return
      const hit = target.closest(interactiveSelector)
      pillRef.current.classList.toggle("is-interactive", Boolean(hit))
    }

    const onLeave = () => {
      pillRef.current?.classList.remove("is-visible")
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    document.addEventListener("mouseleave", onLeave)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("mouseleave", onLeave)
      document.documentElement.classList.remove("has-custom-cursor")
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={pillRef} className="cursor-pill" aria-hidden="true">
        [Build]
      </div>
    </>
  )
}
