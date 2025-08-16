import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { UserService } from '@/lib/services/user'
import { cookies } from 'next/headers'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const handler = NextAuth({
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/register',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const response = await UserService.login(email, password)
          if (!response.ok) {
            return null
          }
          
          const data = await response.json();

          const accessToken = data.access_token
          if (!accessToken) {
            return null
          }

          const user = await UserService.getProfile(accessToken)
          if (!user) {
            return null
          }

          const cookieStore = await cookies()
          cookieStore.set('access_token', accessToken)
          cookieStore.set('user_id', user.id)

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
            rights: user.rights?.map(ur => ur.name),
            //agency: user.agency,
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
})

export { handler as GET, handler as POST }