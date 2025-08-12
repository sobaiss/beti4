import { prisma } from '@/lib/prisma'
import { CreatePropertyInput, UpdatePropertyInput } from '@/lib/validations/property'
import { PropertyType, TransactionType, PropertyStatus } from '@prisma/client'
import { generatePropertyReference } from '@/lib/utils/property-reference'

export interface PropertyFilters {
  location?: string
  propertyTypes?: PropertyType[]
  transactionType?: TransactionType
  priceRange?: [number, number]
  areaRange?: [number, number]
  bedrooms?: number
  status?: PropertyStatus
}

export interface PropertySortOptions {
  field: 'price' | 'area' | 'createdAt'
  direction: 'asc' | 'desc'
}

export class PropertyService {
  static async createProperty(data: CreatePropertyInput & { ownerId: string }) {
    const { amenities, images, agencyId, ...propertyData } = data
    
    // Generate references
    const reference = await generatePropertyReference(data)
    
    return await prisma.property.create({
      data: {
        ...propertyData,
        reference,
        agencyId,
        status: 'brouillon', // New properties start as draft
        amenities: amenities ? {
          create: amenities.map(amenity => ({
            amenityId: amenity.amenityId,
            area: amenity.area,
            amenityCount: amenity.amenityCount
          }))
        } : undefined,
        images: images ? {
          create: images
        } : undefined
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            userType: true,
            isVerified: true
          }
        },
        agency: {
          select: {
            id: true,
            name: true,
            logo: true,
            isVerified: true
          }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        amenities: {
          include: {
            amenity: true
          }
        },
        _count: {
          select: { favorites: true }
        }
      }
    })
  }

  static async getProperties(filters: PropertyFilters = {}, sort: PropertySortOptions = { field: 'createdAt', direction: 'desc' }, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const where: any = {
      status: filters.status || { in: ['disponible', 'vendu', 'loue'] } // Exclude brouillon by default
    }

    if (filters.location) {
      where.OR = [
        { location: { contains: filters.location, mode: 'insensitive' } },
        { city: { contains: filters.location, mode: 'insensitive' } },
        { address: { contains: filters.location, mode: 'insensitive' } }
      ]
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      where.type = { in: filters.propertyTypes }
    }

    if (filters.transactionType) {
      where.transactionType = filters.transactionType
    }

    if (filters.priceRange) {
      where.price = {
        gte: filters.priceRange[0],
        lte: filters.priceRange[1]
      }
    }

    if (filters.areaRange) {
      where.area = {
        gte: filters.areaRange[0],
        lte: filters.areaRange[1]
      }
    }

    if (filters.bedrooms) {
      where.bedrooms = { gte: filters.bedrooms }
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          owner: true,
          agency: true,
          images: {
            orderBy: { order: 'asc' }
          },
          amenities: true
        },
        orderBy: { [sort.field]: sort.direction },
        skip,
        take: limit
      }),
      prisma.property.count({ where })
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

  static async getPropertyById(id: string) {
    return await prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        agency: true,
        images: {
          orderBy: { order: 'asc' }
        },
        amenities: {
          include: {
            amenity: true
          }
        }
      }
    })
  }

  static async updateProperty(id: string, data: UpdatePropertyInput, ownerId: string) {
    const { amenities, images, agencyId, ...propertyData } = data
    
    // Verify ownership
    const property = await prisma.property.findFirst({
      where: { id, ownerId }
    })
    
    if (!property) {
      throw new Error('Property not found or access denied')
    }

    return await prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        agencyId,
        amenities: amenities ? {
          deleteMany: {},
          create: amenities.map(amenity => ({
            amenityId: amenity.amenityId,
            area: amenity.area,
            amenityCount: amenity.amenityCount
          }))
        } : undefined,
        images: images ? {
          deleteMany: {},
          create: images
        } : undefined
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            userType: true,
            isVerified: true
          }
        },
        agency: {
          select: {
            id: true,
            name: true,
            logo: true,
            isVerified: true
          }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        amenities: {
          include: {
            amenity: true
          }
        },
        _count: {
          select: { favorites: true }
        }
      }
    })
  }

  static async deleteProperty(id: string, ownerId: string) {
    // Verify ownership
    const property = await prisma.property.findFirst({
      where: { id, ownerId }
    })
    
    if (!property) {
      throw new Error('Property not found or access denied')
    }

    return await prisma.property.delete({
      where: { id }
    })
  }

  static async toggleFavorite(propertyId: string, userId: string) {
    const existingFavorite = await prisma.propertyFavorite.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    })

    if (existingFavorite) {
      await prisma.propertyFavorite.delete({
        where: { id: existingFavorite.id }
      })
      return { favorited: false }
    } else {
      await prisma.propertyFavorite.create({
        data: { userId, propertyId }
      })
      return { favorited: true }
    }
  }

  static async getFeaturedProperties(limit = 6) {
    return await prisma.property.findMany({
      where: {
        featured: true,
        status: { in: ['disponible'] } // Only show published properties
      },


      
      include: {
        owner: true,
        agency: true,
        images: {
          orderBy: { order: 'asc' }
        },
        amenities: true,
        _count: {
          select: { favorites: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  static async publishProperty(id: string, ownerId: string) {
    // Verify ownership
    const property = await prisma.property.findFirst({
      where: { id, ownerId }
    })
    
    if (!property) {
      throw new Error('Property not found or access denied')
    }

    if (property.status !== 'brouillon') {
      throw new Error('Property is already published')
    }

    return await prisma.property.update({
      where: { id },
      data: {
        status: 'disponible',
        publishedAt: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            userType: true,
            isVerified: true
          }
        },
        agency: {
          select: {
            id: true,
            name: true,
            logo: true,
            isVerified: true
          }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        amenities: {
          include: {
            amenity: true
          }
        },
        _count: {
          select: { favorites: true }
        }
      }
    })
  }

  static async unpublishProperty(id: string, ownerId: string) {
    // Verify ownership
    const property = await prisma.property.findFirst({
      where: { id, ownerId }
    })
    
    if (!property) {
      throw new Error('Property not found or access denied')
    }

    return await prisma.property.update({
      where: { id },
      data: {
        status: 'brouillon',
        publishedAt: null
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            userType: true,
            isVerified: true
          }
        },
        agency: {
          select: {
            id: true,
            name: true,
            logo: true,
            isVerified: true
          }
        },
        images: {
          orderBy: { order: 'asc' }
        },
        amenities: {
          include: {
            amenity: true
          }
        },
        _count: {
          select: { favorites: true }
        }
      }
    })
  }

  static async getDraftProperties(ownerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: {
          ownerId,
          status: 'brouillon'
        },
        include: {
          owner: true,
          agency: true,
          images: {
            orderBy: { order: 'asc' }
          },
          amenities: true
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.property.count({
        where: {
          ownerId,
          status: 'brouillon'
        }
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

  static async incrementPropertyViews(id: string) {
    const property = await prisma.property.findUnique({
      where: { id }
    })
    
    if (!property) {
      throw new Error('Property not found')
    }

    return await prisma.property.update({
      where: { id },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    })
  }

  static async getPropertyViews(id: string) {
    const property = await prisma.property.findUnique({
      where: { id },
      select: {
        views: true
      }
    })
    
    if (!property) {
      throw new Error('Property not found')
    }

    return property.views
  }
}