<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>

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