import { prisma } from '@/lib/prisma'
import { CreateAgencyInput, UpdateAgencyInput } from '@/lib/validations/agency'

export class AgencyService {
  static async createAgency(data: CreateAgencyInput) {
    return await prisma.agency.create({
      data,
      include: {
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    })
  }

  static async verifyAgency(id: string) {
    return await prisma.agency.update({
      where: { id },
      data: {
        status: 'verifie',
        verifiedAt: new Date(),
        lockedAt: null
      },
      include: {
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    })
  }

  static async lockAgency(id: string) {
    return await prisma.agency.update({
      where: { id },
      data: {
        status: 'bloque',
        lockedAt: new Date()
      },
      include: {
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    })
  }

  static async unlockAgency(id: string) {
    return await prisma.agency.update({
      where: { id },
      data: {
        status: 'verifie',
        lockedAt: null
      },
      include: {
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    })
  }

  static async getAgencies(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const [agencies, total] = await Promise.all([
      prisma.agency.findMany({
        include: {
          _count: {
            select: {
              users: true,
              properties: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.agency.count()
    ])

    return {
      agencies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getAgencyById(id: string) {
    return await prisma.agency.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            userType: true,
            isVerified: true,
            createdAt: true
          }
        },
        properties: {
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1
            },
            _count: {
              select: { favorites: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    })
  }

  static async updateAgency(id: string, data: UpdateAgencyInput) {
    return await prisma.agency.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    })
  }

  static async deleteAgency(id: string) {
    // Check if agency has users or properties
    const agency = await prisma.agency.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            properties: true
          }
        }
      }
    })

    if (!agency) {
      throw new Error('Agency not found')
    }

    if (agency._count.users > 0 || agency._count.properties > 0) {
      throw new Error('Cannot delete agency with associated users or properties')
    }

    return await prisma.agency.delete({
      where: { id }
    })
  }

  static async addUserToAgency(userId: string, agencyId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { agencyId },
      include: {
        agency: true
      }
    })
  }

  static async removeUserFromAgency(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { agencyId: null },
      include: {
        agency: true
      }
    })
  }

  static async assignPropertyToAgency(propertyId: string, agencyId: string) {
    return await prisma.property.update({
      where: { id: propertyId },
      data: { agencyId },
      include: {
        agency: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
  }

  static async removePropertyFromAgency(propertyId: string) {
    return await prisma.property.update({
      where: { id: propertyId },
      data: { agencyId: null },
      include: {
        agency: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })
  }

  static async getAgencyStats(id: string) {
    const [agency, propertiesStats] = await Promise.all([
      prisma.agency.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              users: true,
              properties: true
            }
          }
        }
      }),
      prisma.property.groupBy({
        by: ['status', 'transactionType'],
        where: { agencyId: id },
        _count: true
      })
    ])

    if (!agency) {
      throw new Error('Agency not found')
    }

    const stats = {
      totalUsers: agency._count.users,
      totalProperties: agency._count.properties,
      propertiesByStatus: propertiesStats.reduce((acc, stat) => {
        acc[stat.status] = (acc[stat.status] || 0) + stat._count
        return acc
      }, {} as Record<string, number>),
      propertiesByType: propertiesStats.reduce((acc, stat) => {
        acc[stat.transactionType] = (acc[stat.transactionType] || 0) + stat._count
        return acc
      }, {} as Record<string, number>)
    }

    return { agency, stats }
  }
}