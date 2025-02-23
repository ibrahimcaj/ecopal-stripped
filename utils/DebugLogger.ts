// proprietary debug logger, for easier debugging and keeping
const colors = [
  '\x1b[32m', // green
  '\x1b[33m', // yellow
  '\x1b[34m', // blue
  '\x1b[35m', // magenta
  '\x1b[36m', // cyan
  '\x1b[92m', // bright green
];

function stringToColor(str: string): string {
  let colorIndex = 0; // sets initial index to 0
  for (let i = 0; i < str.length; i++) {
    // ide kroz svaki znak stringa
    colorIndex += str.charCodeAt(i); // doda ascii vrijednost tog znaka na index
  }
  colorIndex = colorIndex % colors.length; // modulo operator indexa na duzinu niza
  return colors[colorIndex];
}

// track of backend logs
export function debugLog(origin: string, ...messages: any[]) {
  console.log(`${stringToColor(origin)}[DEBUG - ${origin}] ${messages.join(' ')}\x1b[0m`);
}
