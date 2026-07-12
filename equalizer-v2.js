window.addEventListener('DOMContentLoaded', () => {
  window.animate = function animateCenteredEqualizer() {
    const data = new Uint8Array(analyser.frequencyBinCount);
    const count = bars.length;
    const half = Math.ceil(count / 2);

    const draw = () => {
      if (!audio.paused) {
        analyser.getByteFrequencyData(data);
        bars.forEach((bar, i) => {
          const mirroredIndex = Math.abs(i - (count - 1) / 2);
          const position = mirroredIndex / Math.max(1, half - 1);
          const start = Math.floor(Math.pow(position, 1.8) * data.length * 0.72);
          const end = Math.min(data.length, start + Math.max(2, Math.floor(data.length / half)));
          let total = 0;
          for (let j = start; j < end; j += 1) total += data[j];
          const average = total / Math.max(1, end - start);
          const envelope = 1 - position * 0.22;
          bar.style.height = `${Math.max(3, 3 + average / 255 * 122 * envelope)}px`;
        });
      }
      requestAnimationFrame(draw);
    };
    draw();
  };
});
