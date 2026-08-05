/** Join class names, filtering out falsy values. */
export function Controls(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const cn = Controls;
