import { prisma } from '@/lib/prisma'
import { CreateRightInput, UpdateRightInput } from '@/lib/validations/user'

export class RightService {
  static async createRight(data: CreateRightInput) {
    return await prisma.right.create({
      data,
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    })
  }

  static async getRights(page = 1, limit = 50) {
    const skip = (page - 1) * limit
    
    const [rights, total] = await Promise.all([
      prisma.right.findMany({
        include: {
          _count: {
            select: {
              users: true
            }
          }
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.right.count()
    ])

    return {
      rights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getRightById(id: string) {
    return await prisma.right.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                userType: true,
                status: true
              }
            }
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    })
  }

  static async getRightByName(name: string) {
    return await prisma.right.findUnique({
      where: { name },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    })
  }

  static async updateRight(id: string, data: UpdateRightInput) {
    return await prisma.right.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    })
  }

  static async deleteRight(id: string) {
    // Check if right is assigned to any users
    const right = await prisma.right.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    })

    if (!right) {
      throw new Error('Right not found')
    }

    if (right._count.users > 0) {
      throw new Error('Cannot delete right that is assigned to users')
    }

    return await prisma.right.delete({
      where: { id }
    })
  }

  static async getUsersWithRight(rightId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const [userRights, total] = await Promise.all([
      prisma.userRight.findMany({
        where: { rightId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              userType: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.userRight.count({
        where: { rightId }
      })
    ])

    return {
      users: userRights.map(ur => ur.user),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}