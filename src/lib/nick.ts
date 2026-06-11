export function generateNick(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Invitado-${n}`;
}
