import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { SupplierService } from './services/supplier.service';
import { SupplierDto } from './types/supplier.dto';
import { Supplier } from '@prisma/client';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async createSupplier(@Body() supplierDto: SupplierDto): Promise<Supplier> {
    return this.supplierService.createSupplier(supplierDto);
  }

  @Get()
  async getAllSuppliers(): Promise<Supplier[]> {
    return this.supplierService.getAllSuppliers();
  }

  @Put(':id')
  async updateSupplier(
    @Param('id') id: number,
    @Body() supplierDto: Partial<SupplierDto>,
  ): Promise<Supplier> {
    return this.supplierService.updateSupplier(id, supplierDto);
  }
}
