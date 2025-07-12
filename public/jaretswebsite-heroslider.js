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
