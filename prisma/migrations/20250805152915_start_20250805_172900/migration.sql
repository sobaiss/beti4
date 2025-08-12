-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('particulier', 'professionnel', 'interne', 'admin');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('attente_validation', 'valide', 'verifie', 'bloque');

-- CreateEnum
CREATE TYPE "public"."AgencyStatus" AS ENUM ('attente_validation', 'verifie', 'bloque');

-- CreateEnum
CREATE TYPE "public"."AmenityCategory" AS ENUM ('interieur', 'exterieur', 'equipement');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('appartement', 'maison', 'villa', 'bureau_commerce', 'terrain', 'terrain_agricole');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('achat', 'location');

-- CreateEnum
CREATE TYPE "public"."PropertyStatus" AS ENUM ('disponible', 'vendu', 'loue', 'desactive');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userType" "public"."UserType" NOT NULL DEFAULT 'particulier',
    "avatar" TEXT,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'attente_validation',
    "validatedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "acceptMarketing" BOOLEAN NOT NULL DEFAULT false,
    "agencyId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_settings" (
    "id" TEXT NOT NULL,
    "acceptEmailContact" BOOLEAN NOT NULL DEFAULT true,
    "acceptPhoneContact" BOOLEAN NOT NULL DEFAULT true,
    "displayEmail" BOOLEAN NOT NULL DEFAULT false,
    "displayPhone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agencies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "status" "public"."AgencyStatus" NOT NULL DEFAULT 'attente_validation',
    "verifiedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."properties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "type" "public"."PropertyType" NOT NULL,
    "transactionType" "public"."TransactionType" NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER,
    "area" INTEGER NOT NULL,
    "floor" INTEGER,
    "totalFloors" INTEGER,
    "yearBuilt" INTEGER,
    "energyRating" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."PropertyStatus" NOT NULL DEFAULT 'disponible',
    "availableAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    "agencyId" TEXT,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "property_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_amenities" (
    "id" TEXT NOT NULL,
    "area" INTEGER,
    "amenityCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "property_amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."property_favorites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "property_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saved_searches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "alertsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rights" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_rights" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "rightId" TEXT NOT NULL,

    CONSTRAINT "user_rights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."amenities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "public"."AmenityCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "public"."user_settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "property_favorites_userId_propertyId_key" ON "public"."property_favorites"("userId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "rights_name_key" ON "public"."rights"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_rights_userId_rightId_key" ON "public"."user_rights"("userId", "rightId");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "public"."amenities"("name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."properties" ADD CONSTRAINT "properties_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "public"."agencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_images" ADD CONSTRAINT "property_images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_amenities" ADD CONSTRAINT "property_amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_amenities" ADD CONSTRAINT "property_amenities_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "public"."amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_favorites" ADD CONSTRAINT "property_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."property_favorites" ADD CONSTRAINT "property_favorites_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_searches" ADD CONSTRAINT "saved_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_rights" ADD CONSTRAINT "user_rights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_rights" ADD CONSTRAINT "user_rights_rightId_fkey" FOREIGN KEY ("rightId") REFERENCES "public"."rights"("id") ON DELETE CASCADE ON UPDATE CASCADE;
