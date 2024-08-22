interface Memory extends Record<string, unknown> {}

declare const global: {
  Memory: Memory
}

if (!global.Memory) global.Memory = {}

function setDefaultValue<T>(key: string, defaultValue: T) {
  if (defaultValue !== undefined && !(key in global.Memory)) global.Memory[key] = defaultValue
}

export function getMemory<T>(key: string, defaultValue?: T): T {
  setDefaultValue(key, defaultValue)
  return global.Memory[key] as T
}

export function setMemory<T>(key: string, value: T): void {
  if (value === global.Memory[key]) return
  console.log(`[Memory]: ${key} = ${value}`)
  global.Memory[key] = value
}

export function useMemory<T>(key: string, defaultValue: T): [() => T, (value: T) => void] {
  setDefaultValue(key, defaultValue)
  return [() => getMemory(key), (value) => setMemory(key, value)]
}
