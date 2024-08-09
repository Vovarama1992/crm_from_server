import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateSaleDto, SaleDto } from '../types/sale.dto';
import { Sale } from '@prisma/client';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async createSale(data: SaleDto): Promise<Sale> {
    return this.prisma.sale.create({
      data: {
        ...data,
      },
    });
  }

  async getAllSales(): Promise<Sale[]> {
    return this.prisma.sale.findMany();
  }

  async getSaleById(id: number): Promise<Sale | null> {
    return this.prisma.sale.findUnique({
      where: { id },
    });
  }

  async getSalesByUser(userId: number): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: { userId },
    });
  }

  async getSalesByLogisticsRole(): Promise<Sale[]> {
    return this.prisma.sale.findMany({
      where: {
        user: {
          roleName: 'Логист', // Роль 'Logist' должна быть определена в вашей базе данных
        },
      },
      include: {
        user: true, // Включаем пользователя, чтобы проверить его роль
      },
    });
  }

  async updateSale(id: number, updated: UpdateSaleDto): Promise<Sale> {
    return this.prisma.sale.update({
      where: { id },
      data: updated,
    });
  }
}
