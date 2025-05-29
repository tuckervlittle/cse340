const input = document.getElementById('password')
const button = document.getElementById('view-hide')
if (!document.getElementById('pass-len')) {
  
} else {
  const len = document.getElementById('pass-len')
  const cap = document.getElementById('pass-cap')
  const num = document.getElementById('pass-num')
  const spec = document.getElementById('pass-spec')
  
  checkPass()
  
  function checkPass() {
    document.addEventListener('keyup', () => {
      const value = input.value

      const isLongEnough = value.length >= 12
      const hasCapital = /[A-Z]/.test(value)
      const hasNumber = /[0-9]/.test(value)
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)

      const toggleClass = (element, condition) => {
        element.classList.remove('no-has', 'yes-has')
        element.classList.add(condition ? 'yes-has' : 'no-has')
      }

      toggleClass(len, isLongEnough)
      toggleClass(cap, hasCapital)
      toggleClass(num, hasNumber)
      toggleClass(spec, hasSpecial)
    })
  }
}

button.addEventListener('click', () => {
  const type = input.getAttribute('type')
  if (type == 'password' && input.value.length > 0) {
    input.setAttribute('type', 'text')
  } else {
    input.setAttribute('type', 'password')
  }
})
