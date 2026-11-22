export const getEventValue = (event: Event) => {
  return (event.target as HTMLInputElement).value;
};

export const getEventSelectValue = (event: Event) => {
  return (event.target as HTMLSelectElement).value;
};

export const selectTarget = (event: Event) => {
  return (event.target as HTMLInputElement).select();
};

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}
