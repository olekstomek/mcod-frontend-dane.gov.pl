export function removeEmptyFields<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0),
    ),
  ) as T;
}
