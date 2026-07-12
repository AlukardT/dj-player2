window.addEventListener('DOMContentLoaded', () => {
  window.animate = function animateBottomEqualizer() {
    const data = new Uint8Array(analyser.frequencyBinCount);
    const smoothed = new Array(bars.length).fill(3);

    const draw = () => {
      if (!audio.paused) {
        analyser.getByteFrequencyData(data);
        bars.forEach((bar, i) => {
          const position = i / Math.max(1, bars.length - 1);
          const start = Math.floor(Math.pow(position, 1.7) * data.length * 0.72);
          const width = Math.max(2, Math.floor(data.length / bars.length) + 1);
          const end = Math.min(data.length, start + width);
          let total = 0;
          for (let j = start; j < end; j += 1) total += data[j];
          const average = total / Math.max(1, end - start);
          const compensation = 1 + position * 0.58;
          const target = Math.max(3, 3 + average / 255 * 132 * compensation);
          smoothed[i] += (target - smoothed[i]) * (target > smoothed[i] ? 0.38 : 0.18);
          bar.style.height = `${Math.min(140, smoothed[i])}px`;
        });
      }
      requestAnimationFrame(draw);
    };
    draw();
  };
});
