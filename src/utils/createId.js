export function createId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}
