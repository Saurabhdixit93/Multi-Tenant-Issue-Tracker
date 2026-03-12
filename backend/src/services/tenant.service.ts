import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

export class TenantService {
  static async getTenantDetails(tenantId: string) {
    return prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        domain: true,
        createdAt: true,
      },
    });
  }

  static async updateTenantDetails(tenantId: string, data: { name?: string; slug?: string }) {
    return prisma.tenant.update({
      where: { id: tenantId },
      data,
    });
  }

  static async getTenantMembers(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  static async createMember(tenantId: string, data: any) {
    const { email, password, name, role } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'USER',
        tenantId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
