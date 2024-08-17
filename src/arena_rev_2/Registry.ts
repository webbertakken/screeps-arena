export interface RegistryProps {
  armyReady: boolean
  initialConstruction: boolean
  [key: string]: any
}

declare const globalThis: { registry: RegistryProps }

// Lightweight registry for global state
export class Registry {
  private static get registry(): RegistryProps {
    return globalThis.registry
  }

  private static set registry(value: RegistryProps) {
    globalThis.registry = value
  }

  static init(): void {
    this.clear()
  }

  static clear(): void {
    this.registry = {
      armyReady: false,
      initialConstruction: false,
    }
  }

  static get(key: string) {
    return this.registry[key]
  }

  static set(key: string, value: any) {
    this.registry[key] = value
  }
}
