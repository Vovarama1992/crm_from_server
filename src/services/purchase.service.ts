import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePurchaseDto } from '../types/purchase.dto';
import { CreateInvoiceLineDto } from '../types/purchase.dto';
import { CreateSupplierLineDto } from '../types/purchase.dto';
import { CreateLogisticsLineDto } from '../types/purchase.dto';
import {
  Purchase,
  InvoiceLine,
  SupplierLine,
  LogisticsLine,
} from '@prisma/client';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchase(data: CreatePurchaseDto): Promise<Purchase> {
    const purchase = await this.prisma.purchase.create({
      data: {
        ...data,
      },
    });

    const uniqueArticleNumber = `ARTICLE_${Date.now()}`;

    const defaultInvoiceLine: CreateInvoiceLineDto = {
      purchaseId: purchase.id,
      articleNumber: uniqueArticleNumber,
      description: 'Default Description',
      quantity: 1,
      unitPrice: 100,
      totalPrice: 100,
      comment: 'Default comment',
    };

    const defaultSupplierLine: CreateSupplierLineDto = {
      purchaseId: purchase.id,
      supplierId: 1,
      articleNumber: uniqueArticleNumber,
      description: 'Default Description',
      quantity: 1,
      supplierInvoice: 'DEFAULT_INVOICE',
      totalPurchaseAmount: 100,
      paymentDate: new Date().toISOString(),
      shipmentDate: new Date().toISOString(),
      delivered: false,
      comment: 'Default comment',
    };

    const defaultLogisticsLine: CreateLogisticsLineDto = {
      purchaseId: purchase.id,
      date: new Date().toISOString(),
      description: 'Default Description',
      carrier: 'Default Carrier',
      amount: 100,
    };

    await this.prisma.invoiceLine.create({
      data: defaultInvoiceLine,
    });

    await this.prisma.supplierLine.create({
      data: defaultSupplierLine,
    });

    await this.prisma.logisticsLine.create({
      data: defaultLogisticsLine,
    });

    return purchase;
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return this.prisma.purchase.findMany();
  }

  async updatePurchase(
    id: number,
    data: Partial<CreatePurchaseDto>,
  ): Promise<Purchase> {
    return this.prisma.purchase.update({
      where: { id: Number(id) }, // Убедимся, что id — число
      data: {
        ...data,
      },
    });
  }

  async updateInvoiceLine(
    id: number,
    data: Partial<CreateInvoiceLineDto>,
  ): Promise<InvoiceLine> {
    return this.prisma.invoiceLine.update({
      where: { id: Number(id) }, // Убедимся, что id — число
      data: {
        ...data,
      },
    });
  }

  async updateSupplierLine(
    id: number,
    data: Partial<CreateSupplierLineDto>,
  ): Promise<SupplierLine> {
    return this.prisma.supplierLine.update({
      where: { id: Number(id) }, // Убедимся, что id — число
      data: {
        ...data,
      },
    });
  }

  async updateLogisticsLine(
    id: number,
    data: Partial<CreateLogisticsLineDto>,
  ): Promise<LogisticsLine> {
    return this.prisma.logisticsLine.update({
      where: { id: Number(id) }, // Убедимся, что id — число
      data: {
        ...data,
      },
    });
  }

  // Новый метод для получения всех invoice lines по purchaseId
  async getInvoiceLinesByPurchaseId(
    purchaseId: number,
  ): Promise<InvoiceLine[]> {
    return this.prisma.invoiceLine.findMany({
      where: { purchaseId: Number(purchaseId) }, // Преобразуем purchaseId в число
    });
  }

  // Новый метод для получения всех supplier lines по purchaseId
  async getSupplierLinesByPurchaseId(
    purchaseId: number,
  ): Promise<SupplierLine[]> {
    return this.prisma.supplierLine.findMany({
      where: { purchaseId: Number(purchaseId) }, // Преобразуем purchaseId в число
    });
  }

  // Новый метод для получения всех logistics lines по purchaseId
  async getLogisticsLinesByPurchaseId(
    purchaseId: number,
  ): Promise<LogisticsLine[]> {
    return this.prisma.logisticsLine.findMany({
      where: { purchaseId: Number(purchaseId) }, // Преобразуем purchaseId в число
    });
  }
}
