import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SupplierDto } from '../types/supplier.dto';
import { Supplier } from '@prisma/client';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier(data: SupplierDto): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: {
        ...data,
      },
    });
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany();
  }

  async updateSupplier(
    id: number,
    data: Partial<SupplierDto>,
  ): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}
