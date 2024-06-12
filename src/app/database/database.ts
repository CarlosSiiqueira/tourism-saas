import { PrismaClient } from "@prisma/client"

class PrismaManager {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient({
      log: ["info"]
    })
  }

  getPrisma() {
    return this.prisma
  }

  async disconnect() {
    await this.prisma.$disconnect()
  }
}

const prismaManager = new PrismaManager()
export default prismaManager
