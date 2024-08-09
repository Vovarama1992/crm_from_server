import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { SaleService } from './services/sale.service';
import { UpdateSaleDto } from './types/sale.dto';
import { Sale } from '@prisma/client';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async getAllSales(): Promise<Sale[]> {
    return this.saleService.getAllSales();
  }

  @Get(':id')
  async getSale(@Param('id') id: string): Promise<Sale> {
    const sale = await this.saleService.getSaleById(Number(id));
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  @Get('user/:userId')
  async getSalesByUser(@Param('userId') userId: string): Promise<Sale[]> {
    return this.saleService.getSalesByUser(Number(userId));
  }

  @Get('logistics')
  async getSalesByLogisticsRole(): Promise<Sale[]> {
    return this.saleService.getSalesByLogisticsRole();
  }

  @Put(':id')
  async updateSale(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Promise<Sale> {
    return this.saleService.updateSale(Number(id), updateSaleDto);
  }
}
