export function setupCounter(element) {
  let count = 0
  const output = element.querySelector('#count')

  function render() {
    output.textContent = count
    element.dataset.sign = count > 0 ? 'positive' : count < 0 ? 'negative' : 'zero'
  }

  element.querySelectorAll('[data-step]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = count + Number(button.dataset.step)
      if (!Number.isSafeInteger(next)) return
      count = next
      render()
    })
  })

  element.querySelector('[data-reset]').addEventListener('click', () => {
    count = 0
    render()
  })

  render()
}

