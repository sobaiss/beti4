import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      phone: string
      userType: string
      avatar?: string
      status: string
      validatedAt?: Date
      verifiedAt?: Date
      acceptMarketing: boolean
      settings?: any
      rights?: any[]
      agency?: any
      createdAt: Date
      updatedAt?: Date
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    firstName: string
    lastName: string
    phone: string
    userType: string
    avatar?: string
    status: string
    validatedAt?: Date
    verifiedAt?: Date
    acceptMarketing: boolean
    settings?: any
    rights?: any[]
    agency?: any
    createdAt: Date
    updatedAt?: Date
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    firstName: string
    lastName: string
    phone: string
    userType: string
    avatar?: string
    status: string
    validatedAt?: Date
    verifiedAt?: Date
    acceptMarketing: boolean
    settings?: any
    rights?: any[]
    agency?: any
    createdAt: Date
    updatedAt?: Date
  }
}