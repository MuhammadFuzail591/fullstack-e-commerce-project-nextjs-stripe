/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'

const prismaClientSingelton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingelton>
}

const db = globalThis.prisma ?? prismaClientSingelton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
