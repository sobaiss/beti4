import { PrismaClient } from '@prisma/client'
import { mockProperties } from '../data/mockProperties'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

    // Clear existing data
    // await prisma.right.deleteMany({})
    // await prisma.agency.deleteMany({})
    // await prisma.user.deleteMany({})
    // await prisma.property.deleteMany({})
    // await prisma.amenity.deleteMany({})

  // Create amenities first
  console.log('📝 Creating amenities...')
  const amenities = await Promise.all([
    // Interior amenities
    prisma.amenity.upsert({
      where: { name: 'Ascenseur' },
      update: {},
      create: { name: 'Ascenseur', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Balcon' },
      update: {},
      create: { name: 'Balcon', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Parking' },
      update: {},
      create: { name: 'Parking', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Cave' },
      update: {},
      create: { name: 'Cave', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Concierge' },
      update: {},
      create: { name: 'Concierge', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Jardin' },
      update: {},
      create: { name: 'Jardin', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Garage' },
      update: {},
      create: { name: 'Garage', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Cheminée' },
      update: {},
      create: { name: 'Cheminée', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Terrasse' },
      update: {},
      create: { name: 'Terrasse', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Buanderie' },
      update: {},
      create: { name: 'Buanderie', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Vue Mer' },
      update: {},
      create: { name: 'Vue Mer', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Piscine' },
      update: {},
      create: { name: 'Piscine', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Salle de Sport' },
      update: {},
      create: { name: 'Salle de Sport', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Poutres Apparentes' },
      update: {},
      create: { name: 'Poutres Apparentes', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Cuisine Moderne' },
      update: {},
      create: { name: 'Cuisine Moderne', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Hauts Plafonds' },
      update: {},
      create: { name: 'Hauts Plafonds', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Style Industriel' },
      update: {},
      create: { name: 'Style Industriel', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Grandes Fenêtres' },
      update: {},
      create: { name: 'Grandes Fenêtres', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Proche Écoles' },
      update: {},
      create: { name: 'Proche Écoles', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Quartier Calme' },
      update: {},
      create: { name: 'Quartier Calme', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Rangements' },
      update: {},
      create: { name: 'Rangements', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Sols Marbre' },
      update: {},
      create: { name: 'Sols Marbre', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Proche Plage' },
      update: {},
      create: { name: 'Proche Plage', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Caractère Historique' },
      update: {},
      create: { name: 'Caractère Historique', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Cour' },
      update: {},
      create: { name: 'Cour', category: 'exterieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Murs Pierre' },
      update: {},
      create: { name: 'Murs Pierre', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Poutres Bois' },
      update: {},
      create: { name: 'Poutres Bois', category: 'interieur' }
    }),
    prisma.amenity.upsert({
      where: { name: 'Centre Ville' },
      update: {},
      create: { name: 'Centre Ville', category: 'exterieur' }
    })
  ])

  console.log(`✅ Created ${amenities.length} amenities`)

  // Create a sample user for property ownership
  console.log('👤 Creating sample users...')
  const sampleUser = await prisma.user.upsert({
    where: { email: 'djonkamla2@gmail.com' },
    update: {},
    create: {
      email: 'djonkamla2@gmail.com',
      firstName: 'Brahim',
      lastName: 'Ahmat',
      phone: '0621831282',
      userType: 'particulier',
      status: 'verifie',
      acceptMarketing: true,
      createdAt: new Date(),
      verifiedAt: new Date(),
      validatedAt: new Date(),
      settings: {
        create: {
          acceptEmailContact: true,
          acceptPhoneContact: true,
          displayEmail: true,
          displayPhone: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      password: await bcrypt.hash('linaayele', 10)
    }
  })

  console.log('✅ Created sample user')

  // Create properties from mockData
  console.log('🏠 Creating properties...')
  
  for (const mockProperty of mockProperties) {
    console.log(`Creating property: ${mockProperty.title}`)
    
    // Create property
    const property = await prisma.property.create({
      data: {
        title: mockProperty.title,
        description: mockProperty.description,
        price: mockProperty.price,
        location: mockProperty.location,
        type: mockProperty.type,
        transactionType: mockProperty.transactionType,
        bedrooms: mockProperty.bedrooms,
        bathrooms: mockProperty.bathrooms,
        area: mockProperty.area,
        yearBuilt: mockProperty.yearBuilt,
        energyRating: mockProperty.energyRating,
        featured: mockProperty.featured,
        status: 'disponible',
        ownerId: sampleUser.id,
      }
    })

    // Add amenities to property
    if (mockProperty.amenities && mockProperty.amenities.length > 0) {
      for (const propAmenity of mockProperty.amenities) {
        const amenity = amenities.find(a => a.name === propAmenity.amenity?.name)
        if (amenity) {
          await prisma.propertyAmenity.create({
            data: {
              propertyId: property.id,
              amenityId: amenity.id,
              amenityCount: 1,
              createdAt: new Date(),
            }
          })
        }
      }
    }

    // Add images to property
    if (mockProperty.images && mockProperty.images.length > 0) {
      for (const propImage of mockProperty.images) {
          await prisma.propertyImage.create({
            data: {
              propertyId: property.id,
              url: propImage.url,
              alt: propImage.alt,
              order: propImage.order,
              createdAt: new Date() // Ensure createdAt is set
            }
          })
      }
    }
  }

  console.log(`✅ Created ${mockProperties.length} properties`)

  // Create some sample rights
  console.log('🔐 Creating sample rights...')
  const rights = await Promise.all([
    prisma.right.upsert({
      where: { name: 'MANAGE_USERS' },
      update: {},
      create: { name: 'MANAGE_USERS' }
    }),
    prisma.right.upsert({
      where: { name: 'MANAGE_PROPERTIES' },
      update: {},
      create: { name: 'MANAGE_PROPERTIES' }
    }),
    prisma.right.upsert({
      where: { name: 'MANAGE_AGENCIES' },
      update: {},
      create: { name: 'MANAGE_AGENCIES' }
    }),
    prisma.right.upsert({
      where: { name: 'VIEW_ANALYTICS' },
      update: {},
      create: { name: 'VIEW_ANALYTICS' }
    }),
    prisma.right.upsert({
      where: { name: 'MODERATE_CONTENT' },
      update: {},
      create: { name: 'MODERATE_CONTENT' }
    })
  ])

  console.log(`✅ Created ${rights.length} rights`)

  // Create admin user with all rights
  console.log('👑 Creating admin user...')
  const adminUser = await prisma.user.upsert({
    where: { email: 'bairing.djonkamla@gmail.com' },
    update: {},
    create: {
      email: 'bairing.djonkamla@gmail.com',
      firstName: 'Bairing',
      lastName: 'Djonkamla',
      phone: '0621831282',
      userType: 'admin',
      status: 'verifie',
      acceptMarketing: false,
      settings: {
        create: {
          acceptEmailContact: true,
          acceptPhoneContact: true,
          displayEmail: false,
          displayPhone: false
        }
      },
      password: await bcrypt.hash('linaayele', 10)
    }
  })

  // Assign all rights to admin
  for (const right of rights) {
    await prisma.userRight.upsert({
      where: {
        userId_rightId: {
          userId: adminUser.id,
          rightId: right.id
        }
      },
      update: {},
      create: {
        userId: adminUser.id,
        rightId: right.id
      }
    })
  }

  console.log('✅ Created admin user with all rights')

  // Create sample agency
  console.log('🏢 Creating sample agency...')
  const sampleAgency = await prisma.agency.upsert({
    where: { name: 'Beti Demo Agency', id: '<agency-id>' },
    update: {},
    create: {
      name: 'Beti Demo Agency',
      description: 'A demo real estate agency for Beti platform',
      address: '123 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      phone: '01 42 56 78 90',
      email: 'contact@demoagency.com',
      website: 'https://demoagency.com',
      status: 'verifie',
      verifiedAt: new Date()
    }
  })

  // Assign sample user to agency
  await prisma.user.update({
    where: { id: sampleUser.id },
    data: { 
      agencyId: sampleAgency.id
    }
  })

  console.log('✅ Created sample agency with main contact')

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })