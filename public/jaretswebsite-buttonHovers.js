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