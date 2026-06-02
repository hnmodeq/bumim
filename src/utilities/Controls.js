export function Controls(...classes) {
  return classes.filter(Boolean).join(" ");
}
