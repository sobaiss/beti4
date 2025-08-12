import { prisma } from '@/lib/prisma'
import { CreateAmenityInput, UpdateAmenityInput } from '@/lib/validations/amenity'
import { PropertyAmenityCategoryEnum } from '@/types/property'

export class AmenityService {
  static async createAmenity(data: CreateAmenityInput) {
    return await prisma.amenity.create({
      data,
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      }
    })
  }

  static async getAmenities(category?: PropertyAmenityCategoryEnum, page = 1, limit = 50) {
    const skip = (page - 1) * limit
    
    const where = category ? { category } : {}
    
    const [amenities, total] = await Promise.all([
      prisma.amenity.findMany({
        where,
        include: {
          _count: {
            select: {
              properties: true
            }
          }
        },
        orderBy: [
          { category: 'asc' },
          { name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.amenity.count({ where })
    ])

    return {
      amenities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getAmenityById(id: string) {
    return await prisma.amenity.findUnique({
      where: { id },
      include: {
        properties: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                location: true,
                price: true,
                type: true,
                transactionType: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            properties: true
          }
        }
      }
    })
  }

  static async getAmenityByName(name: string) {
    return await prisma.amenity.findUnique({
      where: { name },
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      }
    })
  }

  static async updateAmenity(id: string, data: UpdateAmenityInput) {
    return await prisma.amenity.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      }
    })
  }

  static async deleteAmenity(id: string) {
    // Check if amenity is used by any properties
    const amenity = await prisma.amenity.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      }
    })

    if (!amenity) {
      throw new Error('Amenity not found')
    }

    if (amenity._count.properties > 0) {
      throw new Error('Cannot delete amenity that is used by properties')
    }

    return await prisma.amenity.delete({
      where: { id }
    })
  }

  static async getAmenitiesByCategory() {
    const amenities = await prisma.amenity.findMany({
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return {
      interieur: amenities.filter(a => a.category === 'interieur'),
      exterieur: amenities.filter(a => a.category === 'exterieur')
    }
  }

  static async getPopularAmenities(limit = 10) {
    return await prisma.amenity.findMany({
      include: {
        _count: {
          select: {
            properties: true
          }
        }
      },
      orderBy: {
        properties: {
          _count: 'desc'
        }
      },
      take: limit
    })
  }
}