window.addEventListener('DOMContentLoaded', () => {
  const levels = new Array(54).fill(0.02);

  const drawSymmetricEqualizer = () => {
    const available = typeof analyser !== 'undefined' && analyser && typeof audio !== 'undefined';
    const playing = available && !audio.paused;

    if (playing) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      const count = bars.length;
      const half = Math.ceil(count / 2);

      for (let i = 0; i < half; i += 1) {
        const position = i / Math.max(1, half - 1);
        const start = Math.floor(Math.pow(position, 1.7) * data.length * 0.72);
        const end = Math.min(data.length, start + 4);
        let total = 0;
        for (let j = start; j < end; j += 1) total += data[j];
        const average = total / Math.max(1, end - start);
        const target = Math.max(0.025, average / 255 * (1 - position * 0.16));
        const left = half - 1 - i;
        const right = count - half + i;
        const current = levels[left] || 0.02;
        const value = current + (target - current) * (target > current ? 0.42 : 0.20);
        levels[left] = value;
        levels[right] = value;
      }
    } else {
      for (let i = 0; i < levels.length; i += 1) levels[i] += (0.02 - levels[i]) * 0.18;
    }

    if (typeof bars !== 'undefined') {
      bars.forEach((bar, i) => { bar.style.transform = `scaleY(${levels[i] || 0.02})`; });
    }
    requestAnimationFrame(drawSymmetricEqualizer);
  };

  requestAnimationFrame(drawSymmetricEqualizer);
});
