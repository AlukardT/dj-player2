window.addEventListener('DOMContentLoaded', () => {
  const count = 54;
  const levels = new Array(count).fill(0.02);
  const targets = new Array(count).fill(0.02);

  const drawWaveEqualizer = () => {
    const available = typeof analyser !== 'undefined' && analyser && typeof audio !== 'undefined';
    const playing = available && !audio.paused;

    if (playing) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);

      for (let i = 0; i < count; i += 1) {
        const position = i / Math.max(1, count - 1);
        const wave = (position * 2.35 + 0.18) % 2;
        const folded = wave <= 1 ? wave : 2 - wave;
        const frequencyPosition = 0.06 + folded * 0.70;
        const start = Math.floor(Math.pow(frequencyPosition, 1.45) * data.length);
        const end = Math.min(data.length, start + 5);
        let total = 0;
        for (let j = start; j < end; j += 1) total += data[j];
        const average = total / Math.max(1, end - start);
        const softWave = 0.84 + 0.16 * Math.sin(position * Math.PI * 5.2 + 0.7);
        targets[i] = Math.max(0.025, average / 255 * softWave);
      }

      const blended = targets.map((value, i) => {
        const left2 = targets[Math.max(0, i - 2)];
        const left1 = targets[Math.max(0, i - 1)];
        const right1 = targets[Math.min(count - 1, i + 1)];
        const right2 = targets[Math.min(count - 1, i + 2)];
        return (left2 + left1 * 2 + value * 3 + right1 * 2 + right2) / 9;
      });

      for (let i = 0; i < count; i += 1) {
        const target = blended[i];
        levels[i] += (target - levels[i]) * (target > levels[i] ? 0.36 : 0.16);
      }
    } else {
      for (let i = 0; i < count; i += 1) levels[i] += (0.02 - levels[i]) * 0.16;
    }

    if (typeof bars !== 'undefined') {
      bars.forEach((bar, i) => { bar.style.transform = `scaleY(${levels[i] || 0.02})`; });
    }
    requestAnimationFrame(drawWaveEqualizer);
  };

  requestAnimationFrame(drawWaveEqualizer);
});
