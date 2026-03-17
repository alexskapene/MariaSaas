import { app } from 'electron'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// 1. On empêche de créer plusieurs instances en mode dev (Hot Reload)
// let prisma: PrismaClient;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// 2. On calcule le chemin absolu vers le fichier dev.db qu'on vient de créer
// En Dev, on remonte depuis 'out/main/lib' vers 'prisma/dev.db'
const dbPath = app.isPackaged
  ? path.join(app.getPath('userData'), 'mariasaas.db')
  : path.join(__dirname, '../../prisma/dev.db')

// 3. On force Prisma à utiliser ce chemin via la variable d'environnement
// C'est l'astuce qui contourne l'erreur "Unknown property datasources"
process.env.DATABASE_URL = `file:${dbPath}`

// 4. On initialise

if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = prisma
}
