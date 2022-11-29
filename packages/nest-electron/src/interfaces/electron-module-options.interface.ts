import type { BrowserWindow } from 'electron'

export interface ElectronModuleOptions {
  name?: string
  win: BrowserWindow
}

export type ElectronModuleProviderValue = (BrowserWindow) | ({ win: BrowserWindow })

export interface ElectronModuleAsyncOptions {
  name?: string
  useFactory: (...args: any[]) => Promise<ElectronModuleProviderValue> | ElectronModuleProviderValue
  inject?: any[]
}
