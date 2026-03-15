import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { setupAuthHandlers } from './ipc/auth'
import { setupUserHandlers } from './ipc/users'
import { authService } from './services/authService'
import { setupInventoryHandlers } from './ipc/inventory'
import { setupSalesHandlers } from './ipc/sales'
import { setupStatsHandlers } from './ipc/stats'
import { setupFinanceHandlers } from './ipc/finance'
import { setupClientHandlers } from './ipc/clients'

// --- CONFIGURATION LINUX "BUNKER" ---
if (process.platform === 'linux') {
  // Sandbox (OK)
  app.commandLine.appendSwitch('no-sandbox')
  app.commandLine.appendSwitch('disable-setuid-sandbox')

  // Forcer X11 (très important)
  app.commandLine.appendSwitch('ozone-platform', 'x11')

  // Optionnel : uniquement si GPU vraiment cassé
  // app.disableHardwareAcceleration();

  // console.log('🐧 Linux Mode: Stable (X11 + No Sandbox)')
}

function createWindow(): void {
  // console.log('🖼️ Tentative création fenêtre...')

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Events de debug fenêtre

  mainWindow.on('unresponsive', () => {
    console.error('⚠️ EVENT: Fenêtre ne répond pas')
  })

  // mainWindow.on('crashed', (e) => {
  //   console.error('❌ EVENT: Fenêtre a crashé', e);
  // })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.once('did-finish-load', () => {
    // console.log('✅ did-finish-load → show()')
    mainWindow.show()
  })

  mainWindow.webContents.on('render-process-gone', (_, details) => {
    console.error('💥 renderer gone', details)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // console.log(`🔗 Load URL: ${process.env['ELECTRON_RENDERER_URL']}`)
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  // console.log('🚀 App Ready...')
  electronApp.setAppUserModelId('com.mariasaas')

  // Init DB
  try {
    await authService.ensureSuperAdminExists()
    // console.log('✅ DB OK');
  } catch (e) {
    console.error(e)
  }

  // Routes
  setupAuthHandlers()
  setupUserHandlers()
  setupInventoryHandlers()
  setupSalesHandlers()
  setupStatsHandlers()
  setupFinanceHandlers()
  setupClientHandlers()
  // Fenêtre (avec petit délai pour laisser le système respirer)
  setTimeout(() => {
    createWindow()
  }, 300)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // console.log('👋 Quit.')
    app.quit()
  }
})
