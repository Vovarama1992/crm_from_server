import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';

enum DealType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
}

enum Stage {
  INVOICE_SENT = 'INVOICE_SENT',
  QUOTE_SENT = 'QUOTE_SENT',
  LOST = 'LOST',
  WORKING_WITH_OBJECTIONS = 'WORKING_WITH_OBJECTIONS',
  DEAL_CLOSED = 'DEAL_CLOSED',
  INVOICE_PAID = 'INVOICE_PAID',
}

enum LossReason {
  EXPENSIVE = 'EXPENSIVE',
  OTHER = 'OTHER',
  DID_NOT_WORK = 'DID_NOT_WORK',
  NO_REPORT = 'NO_REPORT',
  EMPTY_TALK = 'EMPTY_TALK',
}

export class DealDto {
  @ApiProperty({ description: 'Counterparty Name', example: 'ООО Ромашка' })
  @IsNotEmpty()
  @IsString()
  counterpartyName: string;

  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Turnover in Rub', example: 10000 })
  @IsNotEmpty()
  @IsNumber()
  turnoverRub: number;

  @ApiProperty({ description: 'Margin in Rub', example: 2000 })
  @IsNotEmpty()
  @IsNumber()
  marginRub: number;

  @ApiProperty({ description: 'Stage of the deal', enum: Stage })
  @IsNotEmpty()
  @IsEnum(Stage)
  stage: Stage;

  @ApiProperty({ description: 'Close date', example: '2023-08-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  closeDate?: string;

  @ApiProperty({ description: 'Loss reason', enum: LossReason })
  @IsOptional()
  @IsEnum(LossReason)
  lossReason?: LossReason;

  @ApiProperty({ description: 'Comment', example: 'Urgent deal' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ description: 'Type of the deal', enum: DealType })
  @IsNotEmpty()
  @IsEnum(DealType)
  dealType: DealType;

  @ApiProperty({ description: 'Purchase ID', example: 1 })
  @IsOptional()
  @IsInt()
  purchaseId?: number;

  @ApiProperty({ description: 'Sale ID', example: 1 })
  @IsOptional()
  @IsInt()
  saleId?: number;
}
