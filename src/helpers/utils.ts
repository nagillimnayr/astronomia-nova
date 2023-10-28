export function delay(t: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), t));
}
