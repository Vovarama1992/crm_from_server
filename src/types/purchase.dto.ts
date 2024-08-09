import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty({ description: 'Deal ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  dealId: number;

  @ApiProperty({ description: 'Request Number', example: 'REQ123' })
  @IsNotEmpty()
  @IsString()
  requestNumber: string;

  @ApiProperty({ description: 'Counterparty ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  counterpartyId: number;

  @ApiProperty({ description: 'Invoice to Customer', example: 1000.5 })
  @IsNotEmpty()
  @IsNumber()
  invoiceToCustomer: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Delivery Deadline',
    example: '2023-12-31T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  deliveryDeadline: string;
}

export class CreateInvoiceLineDto {
  @ApiProperty({ description: 'Purchase ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  purchaseId: number;

  @ApiProperty({ description: 'Article Number', example: 'ART123' })
  @IsNotEmpty()
  @IsString()
  articleNumber: string;

  @ApiProperty({ description: 'Description', example: 'Product description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({ description: 'Unit Price', example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ description: 'Total Price', example: 1005.0 })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Comment',
    example: 'Optional comment',
    required: false,
  })
  @IsNumber()
  @IsString()
  comment?: string;
}

export class CreateSupplierLineDto {
  @ApiProperty({ description: 'Purchase ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  purchaseId: number;

  @ApiProperty({ description: 'Supplier ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  supplierId: number;

  @ApiProperty({ description: 'Article Number', example: 'ART123' })
  @IsNotEmpty()
  @IsString()
  articleNumber: string;

  @ApiProperty({ description: 'Description', example: 'Product description' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({ description: 'Supplier Invoice', example: 'INV123' })
  @IsNotEmpty()
  @IsString()
  supplierInvoice: string;

  @ApiProperty({ description: 'Total Purchase Amount', example: 500.5 })
  @IsNotEmpty()
  @IsNumber()
  totalPurchaseAmount: number;

  @ApiProperty({ description: 'Payment Date', example: '2023-12-01T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  paymentDate: string;

  @ApiProperty({
    description: 'Shipment Date',
    example: '2023-12-10T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  shipmentDate: string;

  @ApiProperty({ description: 'Delivered', example: true })
  @IsNotEmpty()
  @IsBoolean()
  delivered: boolean;

  @ApiProperty({
    description: 'Comment',
    example: 'Optional comment',
    required: false,
  })
  @IsString()
  comment?: string;
}

export class CreateLogisticsLineDto {
  @ApiProperty({ description: 'Purchase ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  purchaseId: number;

  @ApiProperty({ description: 'Date', example: '2023-12-15T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Description', example: 'To client' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Carrier', example: 'Carrier Name' })
  @IsNotEmpty()
  @IsString()
  carrier: string;

  @ApiProperty({ description: 'Amount', example: 150.75 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
