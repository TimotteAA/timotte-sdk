// __report&__reportParam={ {eventType: 'xxxx', data: { id: 1 } } }
export const sum = (a, b) => a + b;

// __report
export const mul = (a, b) => a * b;

export class Helper {
  // __report
  log() {}
}

// __report&__reportParam={ eventType: 'xxxx', data: { id: 1 } } }
export function test() {}
