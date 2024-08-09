import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DealDto } from '../types/deal.dto';
import { SaleDto } from '../types/sale.dto';
import { CreatePurchaseDto } from 'src/types/purchase.dto';
import { Deal } from '@prisma/client';
import { CounterpartyService } from './counterparty.service';
import { SaleService } from './sale.service';
import { PurchaseService } from './purchase.service'; // Импортируем сервис для покупок
import { DeliveryStage, SigningStage } from '../types/sale.dto';

@Injectable()
export class DealService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly counterpartyService: CounterpartyService,
    private readonly saleService: SaleService,
    private readonly purchaseService: PurchaseService, // Добавляем зависимость от PurchaseService
  ) {}

  async createDeal(data: DealDto): Promise<Deal> {
    const { counterpartyName, ...dealData } = data;
    const counterparty =
      await this.counterpartyService.getCounterpartyByName(counterpartyName);
    if (!counterparty) {
      throw new NotFoundException(
        `Counterparty with name ${counterpartyName} не найден`,
      );
    }

    const deal = await this.prisma.deal.create({
      data: {
        ...dealData,
        counterpartyId: counterparty.id,
      },
    });

    if (data.dealType === 'SALE') {
      const saleData: SaleDto = {
        date: new Date().toISOString(),
        dealId: deal.id,
        counterpartyId: counterparty.id,
        userId: data.userId,
        invoiceNumber: null,
        logisticsCost: null,
        purchaseCost: null,
        saleAmount: null,
        margin: null,
        deliveryStage: DeliveryStage.PURCHASED_FOR_ORDER,
        signingStage: SigningStage.SIGNED_IN_EDO,
      };
      await this.saleService.createSale(saleData);
    }

    if (data.dealType === 'PURCHASE') {
      const purchaseData: CreatePurchaseDto = {
        dealId: deal.id,
        counterpartyId: counterparty.id,
        userId: data.userId,
        requestNumber: 'REQ123',
        invoiceToCustomer: 1000.5,
        deliveryDeadline: '2023-12-31T00:00:00Z',
      };
      await this.purchaseService.createPurchase(purchaseData);
    }

    return deal;
  }

  async updateDeal(id: number, data: Partial<DealDto>) {
    return this.prisma.deal.update({
      where: { id },
      data,
    });
  }

  async getAllDeals() {
    return this.prisma.deal.findMany({
      include: {
        counterparty: {
          select: {
            name: true,
            inn: true,
          },
        },
      },
    });
  }

  async getDealsByUser(userId: number): Promise<Deal[]> {
    return this.prisma.deal.findMany({
      where: { userId },
    });
  }

  async getDealsByDepartment(department_id: number): Promise<Deal[]> {
    return this.prisma.deal.findMany({
      where: {
        user: {
          department_id,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async getDealsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Deal[]> {
    return this.prisma.deal.findMany({
      where: {
        closeDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });
  }

  async getMonthlyTurnoverAndMargin(
    userId: number,
    year: number,
    month: number,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Последний день месяца

    const deals = await this.prisma.deal.findMany({
      where: {
        userId: userId,
        closeDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        turnoverRub: true,
        marginRub: true,
        user: {
          select: {
            yearlyProfitPlan: true,
            margin_percent: true,
          },
        },
      },
    });

    const totalTurnover = deals.reduce(
      (sum, deal) => sum + deal.turnoverRub,
      0,
    );
    const totalMargin = deals.reduce((sum, deal) => sum + deal.marginRub, 0);

    const yearlyProfitPlan = deals[0]?.user.yearlyProfitPlan || 1; // Avoid division by zero
    const marginPercent = deals[0]?.user.margin_percent || 0;

    return {
      userId,
      year,
      month,
      totalTurnover,
      totalMargin,
      yearlyProfitPlan,
      marginPercent,
      completionPercent: (totalMargin / yearlyProfitPlan) * 100,
      marginAmount: (totalMargin * marginPercent) / 100,
    };
  }

  async getAllUsersMonthlyTurnoverAndMargin(
    startDate: string,
    endDate: string,
  ): Promise<any[]> {
    const deals = await this.prisma.deal.findMany({
      where: {
        closeDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        userId: true,
        turnoverRub: true,
        marginRub: true,
        closeDate: true,
        user: {
          select: {
            yearlyProfitPlan: true,
            margin_percent: true,
          },
        },
      },
    });

    const result = deals.reduce((acc, deal) => {
      const userId = deal.userId;
      const month = new Date(deal.closeDate).getMonth() + 1;

      if (!acc[userId]) {
        acc[userId] = {
          userId,
          yearlyProfitPlan: deal.user.yearlyProfitPlan || 1,
          marginPercent: deal.user.margin_percent || 0,
          monthlyData: {},
        };
      }

      if (!acc[userId].monthlyData[month]) {
        acc[userId].monthlyData[month] = {
          totalTurnover: 0,
          totalMargin: 0,
        };
      }

      acc[userId].monthlyData[month].totalTurnover += deal.turnoverRub;
      acc[userId].monthlyData[month].totalMargin += deal.marginRub;

      return acc;
    }, {});

    return Object.values(result).map((user: any) => ({
      ...user,
      monthlyData: Object.entries(user.monthlyData).map(
        ([month, data]: any) => ({
          userId: user.userId,
          year: new Date(startDate).getFullYear(),
          month: Number(month),
          totalTurnover: data.totalTurnover,
          totalMargin: data.totalMargin,
          yearlyProfitPlan: user.yearlyProfitPlan,
          marginPercent: user.marginPercent,
          completionPercent: (data.totalMargin / user.yearlyProfitPlan) * 100,
          marginAmount: (data.totalMargin * user.marginPercent) / 100,
        }),
      ),
    }));
  }
}
