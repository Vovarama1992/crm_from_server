import { Controller, Get, Body, Put, Param } from '@nestjs/common';
import { PurchaseService } from './services/purchase.service';
import { CreatePurchaseDto } from './types/purchase.dto';
import { CreateInvoiceLineDto } from './types/purchase.dto';
import { CreateSupplierLineDto } from './types/purchase.dto';
import { CreateLogisticsLineDto } from './types/purchase.dto';
import {
  Purchase,
  InvoiceLine,
  SupplierLine,
  LogisticsLine,
} from '@prisma/client';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  async getAllPurchases(): Promise<Purchase[]> {
    return this.purchaseService.getAllPurchases();
  }

  @Put(':id')
  async updatePurchase(
    @Param('id') id: number,
    @Body() updatePurchaseDto: Partial<CreatePurchaseDto>,
  ): Promise<Purchase> {
    return this.purchaseService.updatePurchase(id, updatePurchaseDto);
  }

  @Put('invoice-line/:id')
  async updateInvoiceLine(
    @Param('id') id: number,
    @Body() updateInvoiceLineDto: Partial<CreateInvoiceLineDto>,
  ): Promise<InvoiceLine> {
    return this.purchaseService.updateInvoiceLine(id, updateInvoiceLineDto);
  }

  @Put('supplier-line/:id')
  async updateSupplierLine(
    @Param('id') id: number,
    @Body() updateSupplierLineDto: Partial<CreateSupplierLineDto>,
  ): Promise<SupplierLine> {
    return this.purchaseService.updateSupplierLine(id, updateSupplierLineDto);
  }

  @Put('logistics-line/:id')
  async updateLogisticsLine(
    @Param('id') id: number,
    @Body() updateLogisticsLineDto: Partial<CreateLogisticsLineDto>,
  ): Promise<LogisticsLine> {
    return this.purchaseService.updateLogisticsLine(id, updateLogisticsLineDto);
  }

  // Новый маршрут для получения всех invoice lines по purchaseId
  @Get(':purchaseId/invoice-lines')
  async getInvoiceLinesByPurchaseId(
    @Param('purchaseId') purchaseId: number,
  ): Promise<InvoiceLine[]> {
    return this.purchaseService.getInvoiceLinesByPurchaseId(purchaseId);
  }

  // Новый маршрут для получения всех supplier lines по purchaseId
  @Get(':purchaseId/supplier-lines')
  async getSupplierLinesByPurchaseId(
    @Param('purchaseId') purchaseId: number,
  ): Promise<SupplierLine[]> {
    return this.purchaseService.getSupplierLinesByPurchaseId(purchaseId);
  }

  // Новый маршрут для получения всех logistics lines по purchaseId
  @Get(':purchaseId/logistics-lines')
  async getLogisticsLinesByPurchaseId(
    @Param('purchaseId') purchaseId: number,
  ): Promise<LogisticsLine[]> {
    return this.purchaseService.getLogisticsLinesByPurchaseId(purchaseId);
  }
}
