<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/Draggable.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const track = document.querySelector(".carousel-track");
  const navWrapper = document.querySelector(".carousel-nav-wrapper");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const wrapper = document.querySelector(".carousel-wrapper");

  const titleEl = document.querySelector(".carousel-title");
  const descEl = document.querySelector(".carousel-description");

  const projectContent = [
    { title: "Joint Restoration Center", description: "A welcoming site built for patient trust" },
    { title: "Waterlili Health Coaching", description: "A modern wellness brand embracing vibrancy" },
    { title: "Therapy West", description: "A site that mirrors the path to recovery" },
    { title: "Amber Hill", description: "A vibrant careers page to attract top talent" },
    { title: "Joint Restoration Center", description: "Helpful health tips, right at user's fingertips" },
    { title: "Waterlili Health Coaching", description: "Business cards that reflect mindful simplicity" },
    { title: "Joint Restoration Center", description: "Educational content designed to engage" }
  ];

  const originalItems = Array.from(document.querySelectorAll(".carousel-item"));

  // Clone items 5 times
  for (let i = 0; i < 5; i++) {
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }

  const items = Array.from(document.querySelectorAll(".carousel-item"));
  const originalCount = originalItems.length;
  const totalItems = items.length;

  items.forEach(item => {
    item.style.flex = "0 0 auto";
    item.style.width = `${item.offsetWidth}px`;
  });

  let index = originalCount + 1; // Start at second original item
  let currentX = 0;

  function getOffset(i) {
    const target = items[i];
    return -target.offsetLeft + (window.innerWidth / 2 - target.offsetWidth / 2);
  }

  function updateScales() {
    const navRect = navWrapper.getBoundingClientRect();
    const navCenterLeft = navRect.left;
    const navCenterRight = navRect.right;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;

      const isCentered = itemCenterX >= navCenterLeft && itemCenterX <= navCenterRight;

      gsap.to(item, {
        height: isCentered ? "89%" : "100%",
        clearProps: "width",
        transformOrigin: "top center",
        duration: isCentered ? 0.2 : 0.05,
        ease: "power2.out"
      });
    });
  }

  function updateCarouselInfo(i) {
    const content = projectContent[i % projectContent.length];
    gsap.to([titleEl, descEl], {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        titleEl.textContent = content.title;
        descEl.textContent = content.description;
        gsap.fromTo(
          [titleEl, descEl],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
    });
  }

  function jumpToReal(realIndex) {
    index = realIndex;
    currentX = getOffset(index);
    gsap.set(track, { x: currentX });
    updateScales();
  }

  function animateTo(i) {
    index = i;
    currentX = getOffset(i);
    gsap.to(track, {
      x: currentX,
      duration: 0.7,
      ease: "back.out(1.7)",
      onUpdate: updateScales
    });
    updateCarouselInfo(index % originalCount);
  }

  prevBtn.addEventListener("click", () => animateTo(index - 1));
  nextBtn.addEventListener("click", () => animateTo(index + 1));

  const snapPoints = items.map((item, i) => getOffset(i));

  Draggable.create(track, {
    type: "x",
    inertia: true,
    bounds: null,
    dragResistance: 0.2,
    onDrag: updateScales,
    onThrowUpdate: updateScales,

    snap: (value) => {
      let closest = snapPoints[0];
      let closestIndex = 0;
      let minDiff = Math.abs(value - closest);
      for (let i = 1; i < snapPoints.length; i++) {
        const diff = Math.abs(value - snapPoints[i]);
        if (diff < minDiff) {
          closest = snapPoints[i];
          closestIndex = i;
          minDiff = diff;
        }
      }

      index = closestIndex;

      if (index < originalCount) {
        index += originalCount;
        setTimeout(() => jumpToReal(index), 500);
      } else if (index >= totalItems - originalCount) {
        index -= originalCount;
        setTimeout(() => jumpToReal(index), 500);
      }

      return closest;
    },

    onRelease: function () {
      if (!this.isThrowing) {
        let closest = snapPoints[0];
        let closestIndex = 0;
        let minDiff = Math.abs(this.x - closest);
        for (let i = 1; i < snapPoints.length; i++) {
          const diff = Math.abs(this.x - snapPoints[i]);
          if (diff < minDiff) {
            closest = snapPoints[i];
            closestIndex = i;
            minDiff = diff;
          }
        }

        index = closestIndex;

        if (index < originalCount) {
          index += originalCount;
          setTimeout(() => jumpToReal(index), 500);
        } else if (index >= totalItems - originalCount) {
          index -= originalCount;
          setTimeout(() => jumpToReal(index), 500);
        }

        gsap.to(track, {
          x: closest,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: updateScales
        });

        updateCarouselInfo(index % originalCount);
      }
    }
  });

  ScrollTrigger.create({
    trigger: wrapper,
    start: "top bottom",
    end: "bottom top",
    once: true,
    onEnter: () => {
      updateScales();
    }
  });

  index = originalCount + 1;
  currentX = getOffset(index);
  gsap.set(track, { x: currentX });
  updateScales();
  updateCarouselInfo(index % originalCount); // Initial load

  // ✅ Fix: Keep carousel centered on window resize
  window.addEventListener("resize", () => {
    currentX = getOffset(index);
    gsap.set(track, { x: currentX });
    updateScales();
  });
});
</script>


<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>

<script>
document.querySelectorAll('.nav-btn').forEach((btn) => {
  const fill = btn.querySelector('.btn-fill');

  btn.addEventListener('mouseenter', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.killTweensOf([fill, btn]);

    gsap.set(fill, {
      clipPath: `circle(0% at ${x}px ${y}px)`
    });

    gsap.to(fill, {
      clipPath: `circle(150% at ${x}px ${y}px)`,
      duration: 0.5, // faster in
      ease: 'power2.out'
    });

    gsap.to(btn, {
      color: 'black',
      duration: 0.3,
      ease: 'power1.out'
    });
  });

  btn.addEventListener('mouseleave', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.killTweensOf([fill, btn]);

    gsap.to(fill, {
      clipPath: `circle(0% at ${x}px ${y}px)`,
      duration: 0.25, // fast retract
      ease: 'power1.in'
    });

    gsap.to(btn, {
      color: 'white',
      duration: 0.2,
      ease: 'power1.in'
    });
  });
});
</script>

<script>
  Webflow.push(function () {
    const heading = document.querySelector('.mobile-slider-info-heading');
    const paragraph = document.querySelector('.mobile-slider-info-paragraph');

    function updateTextFromSlide() {
      // Find the slide with no aria-hidden attribute
      const activeSlide = Array.from(document.querySelectorAll('.w-slide'))
        .find(slide => !slide.hasAttribute('aria-hidden'));

      if (!activeSlide) {
        console.warn('No active slide found.');
        return;
      }

      const newHeading = activeSlide.getAttribute('data-heading') || '';
      const newParagraph = activeSlide.getAttribute('data-paragraph') || '';

      heading.style.opacity = '0';
      paragraph.style.opacity = '0';

      setTimeout(() => {
        heading.textContent = newHeading;
        paragraph.textContent = newParagraph;
        heading.style.opacity = '1';
        paragraph.style.opacity = '1';
      }, 200);
    }

    // Run on page load
    updateTextFromSlide();

    // Observe all slides for aria-hidden attribute changes
    const slides = document.querySelectorAll('.w-slide');
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          updateTextFromSlide();
        }
      }
    });

    slides.forEach(slide => {
      observer.observe(slide, { attributes: true });
    });
  });
</script>

<script>
// Fade out carousel info on media breakpoint
function toggleCarouselInfo() {
  const info = document.querySelector('.carousel-info');
  if (!info) return;

  if (window.innerWidth <= 1200) {
    info.style.opacity = '0';
    info.style.pointerEvents = 'none';
  } else {
    info.style.opacity = '1';
    info.style.pointerEvents = 'auto';
  }
}

window.addEventListener('DOMContentLoaded', toggleCarouselInfo);
window.addEventListener('resize', toggleCarouselInfo);
</script>

<script>
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }

      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }

    update() {
      let output = '';
      let complete = 0;

      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];

        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }

      this.el.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  // Format mobile phrases with <br> to ensure 3 lines
  function formatWithLineBreaks(text) {
    const words = text.split(' ');
    const totalWords = words.length;
    const wordsPerLine = Math.ceil(totalWords / 3);

    const line1 = words.slice(0, wordsPerLine).join(' ');
    const line2 = words.slice(wordsPerLine, wordsPerLine * 2).join(' ');
    const line3 = words.slice(wordsPerLine * 2).join(' ');

    return [line1, line2, line3].join('<br>');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
      'Make Competitors Jealous',
      'Set the New Status Quo',
      'Market with Confidence',
      'Ditch Boring Designs'
    ];

    const desktopEl = document.querySelector('.rotating-text-heading');
    const mobileEl = document.querySelector('.rotating-text-heading-mobile');

    const desktopScramble = new TextScramble(desktopEl);
    const mobileScramble = new TextScramble(mobileEl);

    let counter = 0;

    const next = () => {
      Promise.all([
        desktopScramble.setText(phrases[counter]),
        mobileScramble.setText(formatWithLineBreaks(phrases[counter]))
      ]).then(() => {
        setTimeout(next, 2000);
      });

      counter = (counter + 1) % phrases.length;
    };

    // Start with first phrase, then continue loop
    Promise.all([
      desktopScramble.setText(phrases[0]),
      mobileScramble.setText(formatWithLineBreaks(phrases[0]))
    ]).then(() => {
      counter = 1;
      setTimeout(next, 2000);
    });
  });
</script>

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