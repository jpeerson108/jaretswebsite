<script>
const images = []
const animationLayer = document.querySelector('.tech-stack-section')
animationLayer.querySelectorAll('.tech-stack-mouse-animation-image').forEach(image => {
  images.push(image.getAttribute('src'))
})

let incr = 0,
    oldIncr = 0,
    firstMove = true,
    resetDist = 40, // triggers more frequently
    indexImg = 0

window.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector('.tech-stack-section')

  section.addEventListener("mousemove", e => {
    const val = e.clientX

    if (firstMove) {
      firstMove = false
      oldIncr = val
      return
    }

    incr += Math.abs(val - oldIncr)
    oldIncr = val

    if (incr > resetDist) {
      incr = 0

      const rect = animationLayer.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      createMedia(x, y)
    }
  })
})

function createMedia(x, y) {
  const image = document.createElement("img")
  image.setAttribute('src', images[indexImg])
  image.style.position = 'absolute'
  image.style.left = `${x}px`
  image.style.top = `${y}px`
  image.style.transform = 'translate(-50%, -50%)'
  image.style.pointerEvents = 'none'

  animationLayer.appendChild(image)

  const tl = gsap.timeline({
    onComplete: () => {
      animationLayer.removeChild(image)
      tl && tl.kill()
    }
  })

  tl.fromTo(image, {
    scale: 1.3,
    rotation: (Math.random() - 0.5) * 20
  }, {
    scale: 1,
    ease: 'elastic.out(2, 0.6)',
    duration: 0.6
  }).to(image, {
    duration: 0.3,
    scale: 0.5,
    delay: 0.1,
    ease: 'back.in(1.5)'
  })

  indexImg = (indexImg + 1) % images.length
}
</script>