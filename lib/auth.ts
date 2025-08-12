import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/register',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
              settings: true,
              rights: {
                include: {
                  right: true
                }
              },
              agency: true
            }
          })

          if (!user) {
            return null
          }

          // Check if user is blocked
          if (user.status === 'bloque') {
            throw new Error('Votre compte a été bloqué. Contactez le support.')
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            userType: user.userType,
            avatar: user.avatar,
            status: user.status,
            validatedAt: user.validatedAt,
            verifiedAt: user.verifiedAt,
            acceptMarketing: user.acceptMarketing,
            settings: user.settings,
            rights: user.rights.map(ur => ur.right),
            agency: user.agency,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins (Google, Facebook)
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Extract names from OAuth profile
            let firstName = user.name?.split(' ')[0] || ''
            let lastName = user.name?.split(' ').slice(1).join(' ') || ''

            // For Google, use given_name and family_name if available
            if (account.provider === 'google' && profile) {
              firstName = (profile as any).given_name || firstName
              lastName = (profile as any).family_name || lastName
            }

            // For Facebook, use first_name and last_name if available
            if (account.provider === 'facebook' && profile) {
              firstName = (profile as any).first_name || firstName
              lastName = (profile as any).last_name || lastName
            }

            // Create new user with OAuth data
            await prisma.user.create({
              data: {
                email: user.email!.toLowerCase(),
                firstName: firstName || 'Utilisateur',
                lastName: lastName || 'OAuth',
                phone: '', // OAuth providers don't always provide phone
                userType: 'particulier',
                avatar: user.image || undefined,
                status: 'valide', // OAuth users are automatically validated
                validatedAt: new Date(),
                acceptMarketing: false,
                password: '', // OAuth users don't have passwords
                settings: {
                  create: {
                    acceptEmailContact: true,
                    acceptPhoneContact: false,
                    displayEmail: false,
                    displayPhone: false
                  }
                }
              }
            })
          } else {
            // Update existing user's avatar if it's from OAuth and we have a new image
            if (user.image && (!existingUser.avatar || existingUser.avatar !== user.image)) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { avatar: user.image }
              })
            }
          }

          return true
        } catch (error) {
          console.error('OAuth sign-in error:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
        token.userType = user.userType
        token.avatar = user.avatar
        token.status = user.status
        token.validatedAt = user.validatedAt
        token.verifiedAt = user.verifiedAt
        token.acceptMarketing = user.acceptMarketing
        token.settings = user.settings
        token.rights = user.rights
        token.agency = user.agency
        token.createdAt = user.createdAt
        token.updatedAt = user.updatedAt
      } else if (token.email) {
        // For OAuth users, fetch fresh data from database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            include: {
              settings: true,
              rights: {
                include: {
                  right: true
                }
              },
              agency: true
            }
          })

          if (dbUser) {
            token.id = dbUser.id
            token.firstName = dbUser.firstName
            token.lastName = dbUser.lastName
            token.phone = dbUser.phone
            token.userType = dbUser.userType
            token.avatar = dbUser.avatar
            token.status = dbUser.status
            token.validatedAt = dbUser.validatedAt
            token.verifiedAt = dbUser.verifiedAt
            token.acceptMarketing = dbUser.acceptMarketing
            token.settings = dbUser.settings
            token.rights = dbUser.rights.map(ur => ur.right)
            token.agency = dbUser.agency
            token.createdAt = dbUser.createdAt
            token.updatedAt = dbUser.updatedAt
          }
        } catch (error) {
          console.error('Error fetching user data for token:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.phone = token.phone as string
        session.user.userType = token.userType as string
        session.user.avatar = token.avatar as string
        session.user.status = token.status as string
        session.user.validatedAt = token.validatedAt as Date
        session.user.verifiedAt = token.verifiedAt as Date
        session.user.acceptMarketing = token.acceptMarketing as boolean
        session.user.settings = token.settings as any
        session.user.rights = token.rights as any
        session.user.agency = token.agency as any
        session.user.createdAt = token.createdAt as Date
        session.user.updatedAt = token.updatedAt as Date
      }
      return session
    }
  }
} as const

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)