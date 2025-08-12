import { prisma } from '@/lib/prisma'
import { CreateUserInput, UpdateUserInput, SavedSearchInput, UserSettingsInput, UpdateUserSettingsInput } from '@/lib/validations/user'

export class UserService {
  static async createUser(data: CreateUserInput) {
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        userType: true,
        avatar: true,
        status: true,
        validatedAt: true,
        verifiedAt: true,
        lockedAt: true,
        acceptMarketing: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Create default user settings
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        acceptEmailContact: true,
        acceptPhoneContact: true,
        displayEmail: false,
        displayPhone: false
      }
    })

    return user
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        settings: true,
        rights: {
          include: {
            right: true
          }
        }
      },
      // select: {
      //   id: true,
      //   email: true,
      //   firstName: true,
      //   lastName: true,
      //   phone: true,
      //   userType: true,
      //   avatar: true,
      //   status: true,
      //   validatedAt: true,
      //   verifiedAt: true,
      //   lockedAt: true,
      //   acceptMarketing: true,
      //   settings: true,
      //   rights: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   _count: {
      //     select: {
      //       properties: true,
      //       favoriteProperties: true,
      //       savedSearches: true
      //     }
      //   }
      // }
    })
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        settings: true,
        rights: {
          include: {
            right: true
          }
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        userType: true,
        avatar: true,
        status: true,
        validatedAt: true,
        verifiedAt: true,
        lockedAt: true,
        acceptMarketing: true,
        settings: true,
        rights: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async updateUser(id: string, data: UpdateUserInput) {
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        settings: true,
        rights: {
          include: {
            right: true
          }
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        userType: true,
        avatar: true,
        status: true,
        validatedAt: true,
        verifiedAt: true,
        lockedAt: true,
        acceptMarketing: true,
        settings: true,
        rights: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id }
    })
  }

  static async getUserProperties(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: { ownerId: userId },
        include: {
          images: {
            orderBy: { order: 'asc' }
          },
          amenities: true,
          _count: {
            select: { favorites: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.property.count({
        where: { ownerId: userId }
      })
    ])

    return {
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getUserFavorites(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const [favorites, total] = await Promise.all([
      prisma.propertyFavorite.findMany({
        where: { userId },
        include: {
          property: {
            include: {
              owner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  userType: true,
                  status: true
                }
              },
              images: {
                orderBy: { order: 'asc' }
              },
              amenities: true,
              _count: {
                select: { favorites: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.propertyFavorite.count({
        where: { userId }
      })
    ])

    return {
      favorites: favorites.map(f => f.property),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async validateUser(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        status: 'valide',
        validatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        userType: true,
        avatar: true,
        status: true,
        validatedAt: true,
        verifiedAt: true,
        lockedAt: true,
        acceptMarketing: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async verifyUser(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        status: 'verifie',
        verifiedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        userType: true,
        avatar: true,
        status: true,
        validatedAt: true,
        verifiedAt: true,
        lockedAt: true,
        acceptMarketing: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async lockUser(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        status: 'bloque',
        lockedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        userType: true,
        avatar: true,
        status: true,
        validatedAt: true,
        verifiedAt: true,
        lockedAt: true,
        acceptMarketing: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async unlockUser(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        status: 'valide',
        lockedAt: null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        userType: true,
        avatar: true,
        status: true,
        validatedAt: true,
        verifiedAt: true,
        lockedAt: true,
        acceptMarketing: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }

  static async createSavedSearch(userId: string, data: SavedSearchInput) {
    return await prisma.savedSearch.create({
      data: {
        ...data,
        userId
      }
    })
  }

  static async getUserSavedSearches(userId: string) {
    return await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async deleteSavedSearch(id: string, userId: string) {
    const savedSearch = await prisma.savedSearch.findFirst({
      where: { id, userId }
    })
    
    if (!savedSearch) {
      throw new Error('Saved search not found or access denied')
    }

    return await prisma.savedSearch.delete({
      where: { id }
    })
  }

  static async getUserSettings(userId: string) {
    return await prisma.userSettings.findUnique({
      where: { userId }
    })
  }

  static async updateUserSettings(userId: string, data: UpdateUserSettingsInput) {
    return await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data
      }
    })
  }

  static async createDefaultUserSettings(userId: string) {
    return await prisma.userSettings.create({
      data: {
        userId,
        acceptEmailContact: true,
        acceptPhoneContact: true,
        displayEmail: false,
        displayPhone: false
      }
    })
  }

  static async assignRightsToUser(userId: string, rightIds: string[]) {
    // Remove existing rights
    await prisma.userRight.deleteMany({
      where: { userId }
    })

    // Add new rights
    const userRights = rightIds.map(rightId => ({
      userId,
      rightId
    }))

    await prisma.userRight.createMany({
      data: userRights
    })

    return await this.getUserById(userId)
  }

  static async addRightToUser(userId: string, rightId: string) {
    const existingRight = await prisma.userRight.findUnique({
      where: {
        userId_rightId: {
          userId,
          rightId
        }
      }
    })

    if (existingRight) {
      throw new Error('User already has this right')
    }

    await prisma.userRight.create({
      data: { userId, rightId }
    })

    return await this.getUserById(userId)
  }

  static async removeRightFromUser(userId: string, rightId: string) {
    await prisma.userRight.deleteMany({
      where: { userId, rightId }
    })

    return await this.getUserById(userId)
  }

  static async getUserRights(userId: string) {
    const userRights = await prisma.userRight.findMany({
      where: { userId },
      include: {
        right: true
      }
    })

    return userRights.map(ur => ur.right)
  }

  static async hasRight(userId: string, rightName: string): Promise<boolean> {
    const userRight = await prisma.userRight.findFirst({
      where: {
        userId,
        right: {
          name: rightName
        }
      }
    })

    return !!userRight
  }
}