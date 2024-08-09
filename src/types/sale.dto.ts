import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';

export enum DeliveryStage {
  PURCHASED_FOR_ORDER = 'PURCHASED_FOR_ORDER',
  IN_STOCK = 'IN_STOCK',
  ITEM_SENT = 'ITEM_SENT',
  ITEM_DELIVERED_FULL = 'ITEM_DELIVERED_FULL',
  ITEM_DELIVERED_PARTIAL = 'ITEM_DELIVERED_PARTIAL',
  RETURN = 'RETURN',
}

export enum SigningStage {
  SIGNED_IN_EDO = 'SIGNED_IN_EDO',
  SIGNED_ON_PAPER = 'SIGNED_ON_PAPER',
}

export class SaleDto {
  @ApiProperty({
    description: 'Date of the sale',
    example: '2023-08-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Unique deal ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  dealId: number;

  @ApiProperty({ description: 'Invoice number', example: 'INV-1001' })
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @ApiProperty({ description: 'Counterparty ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  counterpartyId: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Logistics cost', example: 1500.5 })
  @IsOptional()
  @IsNumber()
  logisticsCost?: number;

  @ApiProperty({ description: 'Purchase cost', example: 10000.0 })
  @IsOptional()
  @IsNumber()
  purchaseCost?: number;

  @ApiProperty({ description: 'Sale amount', example: 12000.0 })
  @IsOptional()
  @IsNumber()
  saleAmount?: number;

  @ApiProperty({ description: 'Margin', example: 2000.0 })
  @IsOptional()
  @IsNumber()
  margin?: number;

  @ApiProperty({ description: 'Delivery stage', enum: DeliveryStage })
  @IsOptional()
  @IsEnum(DeliveryStage)
  deliveryStage?: DeliveryStage = DeliveryStage.PURCHASED_FOR_ORDER;

  @ApiProperty({ description: 'Signing stage', enum: SigningStage })
  @IsOptional()
  @IsEnum(SigningStage)
  signingStage?: SigningStage = SigningStage.SIGNED_IN_EDO;
}

export class UpdateSaleDto extends PartialType(SaleDto) {}
