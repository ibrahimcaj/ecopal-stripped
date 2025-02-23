export function relativeTimeFormat(epoch: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - epoch) / 1000);

  if (diffInSeconds < 0) {
    return 'prije par sekundi';
  }

  const seconds = diffInSeconds % 60;
  const minutes = Math.floor(diffInSeconds / 60) % 60;
  const hours = Math.floor(diffInSeconds / 3600);

  if (hours > 0) {
    return `prije ${hours} sat(i)`;
  } else if (minutes > 0) {
    return `prije ${minutes} minut(a)`;
  } else {
    return `prije ${seconds} sekund(i)`;
  }
}
