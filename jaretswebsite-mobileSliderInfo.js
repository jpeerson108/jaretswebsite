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