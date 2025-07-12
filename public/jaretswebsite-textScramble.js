<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>

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