export function safeText(element, text) {
  if (element && element.textContent !== undefined) {
    if (element.textContent !== text) {
      element.textContent = text
    }
  }
}

export function safeHTML(element, html) {
  if (element && element.innerHTML !== undefined) {
    if (element.innerHTML !== html) {
      element.innerHTML = html
    }
  }
}

export function safeClass(element, className, add = true) {
  if (element && element.classList) {
    if (add) {
      element.classList.add(className)
    } else {
      element.classList.remove(className)
    }
  }
}
