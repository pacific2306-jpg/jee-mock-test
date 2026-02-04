export function startProctoring(onSubmit: () => void) {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      onSubmit()
    }
  })

  window.addEventListener("beforeunload", () => {
    onSubmit()
  })
}
