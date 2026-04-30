const DEFAULTS = { threshold: 0.2, rootMargin: "0px", once: true }

export function initSal(root, opts = {}) {
    if (typeof window === "undefined") return
    const { threshold, rootMargin, once } = { ...DEFAULTS, ...opts }
    const elements = (root ?? document).querySelectorAll("[data-sal]")
    if (!elements.length) return
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("sal-animate")
                    if (once) observer.unobserve(entry.target)
                } else if (!once) {
                    entry.target.classList.remove("sal-animate")
                }
            })
        },
        { threshold, rootMargin }
    )
    elements.forEach(el => observer.observe(el))
}
