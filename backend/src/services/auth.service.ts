import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
  static async register(data: any) {
    const { name, email, password, companyName, companySlug } = data;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // 2. Check if tenant slug already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: companySlug },
    });
    if (existingTenant) {
      throw new Error('Company slug already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create Tenant and Admin User in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          slug: companySlug,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          tenantId: tenant.id,
          role: Role.ADMIN,
        },
      });

      return { tenant, user };
    });

    return this.generateToken(result.user);
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private static generateToken(user: any) {
    if (!JWT_SECRET) {
      throw new Error('Internal security configuration error');
    }
    const token = jwt.sign(
      { 
        sub: user.id, 
        tenantId: user.tenantId, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenantId: user.tenantId,
        role: user.role,
      },
    };
  }
}
