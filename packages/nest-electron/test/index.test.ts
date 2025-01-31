import path from 'path'
import { beforeAll, describe, expect, it, test } from 'vitest'
import { execa } from '@esm2cjs/execa'

const mockDir = path.resolve(__dirname, './mock')
const mockDist = path.resolve(mockDir, 'dist')

const buildMock = async () => {
  const { stdout, stderr } = await execa(
    'tsup',
    {
      cwd: mockDir,
    },
  )

  const logs = stdout + stderr
  return logs
}

const runElectron = async () => {
  const { stdout, stderr } = await execa(
    'npx',
    ['electron', path.resolve(mockDist, 'main.js')],
    {
      cwd: mockDir,
    },
  )

  const logs = stdout + stderr
  return logs
}

describe('Doubleshot Nest Electron Module', () => {
  let logs = ''
  beforeAll(async () => {
    await buildMock()
    logs = await runElectron()
  }, 60 * 1000)

  it('should run electron', () => {
    expect(logs).toContain('Electron is running')
  })

  test('@Window', () => {
    expect(logs).toContain('Inject BrowserWindow successfully')
  })

  test('@Window for multiple windows', () => {
    expect(logs).toContain('Inject another BrowserWindow successfully')
    expect(logs).toContain('Get log: This is an another window')
  })

  test('@IpcHandle', () => {
    expect(logs).toContain('Get data from frontend: send data to backend')
  })

  test('@IpcOn', () => {
    expect(logs).toContain('Get log: Main process received data from frontend')
  })

  it('should get ipc event object from @Ctx', () => {
    expect(logs).toContain('Get ipc event object')
  })

  it('should get an array if send multi params via ipc channel', () => {
    expect(logs).toContain('Get param1: The early bird catches the worm')
    expect(logs).toContain('Get param2: I saw a saw saw a saw')
  })

  it('should throw an error if an error occurs in the main process', () => {
    expect(logs).toContain('IpcExceptionsFilter')
    expect(logs).toContain('Get log: Error invoking remote method \'/error\': Error: This is an error')
  })

  it('should support controller route prefix', () => {
    expect(logs).toContain('Get message from frontend: send message to backend')
    expect(logs).toContain('Get other log: Main process received message from frontend')
  })

  it('should support controller route prefix with or without slash at the beginning or end', () => {
    expect(logs).toContain('invoke with /other/invoke')
    expect(logs).toContain('invoke with other/invoke')
    expect(logs).toContain('invoke with other/invoke/')
    expect(logs).toContain('invoke with /other/invoke/')
  })

  it('should support return an observable', () => {
    expect(logs).toContain('Get other log: Main process return an observable')
  })

  it('should not log if set noLog to true', () => {
    expect(logs).not.toContain('[IPC] Process event no-log-msg')
    expect(logs).toContain('Get no log msg: Go to the sea, if you would fish well')
  })
})
