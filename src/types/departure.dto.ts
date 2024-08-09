import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
  IsEnum,
} from 'class-validator';

enum Destination {
  TO_CLIENT = 'TO_CLIENT',
  TO_US = 'TO_US',
  RETURN_FROM_CLIENT = 'RETURN_FROM_CLIENT',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
}

enum SpecificDestination {
  TO_TERMINAL = 'TO_TERMINAL',
  TO_DOOR = 'TO_DOOR',
}

enum Status {
  SENT_ALL = 'SENT_ALL',
  SENT_PARTIALLY = 'SENT_PARTIALLY',
  DELIVERED_ALL = 'DELIVERED_ALL',
  DELIVERED_PARTIALLY = 'DELIVERED_PARTIALLY',
  PROBLEM = 'PROBLEM',
}

export class DepartureDto {
  @ApiProperty({ description: 'Deal ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  dealId: number;

  @ApiProperty({ description: 'Counterparty ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  counterpartyId: number;

  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Destination',
    enum: Destination,
  })
  @IsOptional()
  @IsEnum(Destination)
  destination?: Destination;

  @ApiProperty({ description: 'Transport company', example: 'DHL' })
  @IsOptional()
  @IsString()
  transportCompany?: string;

  @ApiProperty({ description: 'Tracking number', example: '123456789' })
  @IsNotEmpty()
  @IsString()
  trackingNumber: string;

  @ApiProperty({ description: 'Final amount', example: 1000.5 })
  @IsOptional()
  @IsNumber()
  finalAmount?: number;

  @ApiProperty({
    description: 'Dispatch date',
    example: '2023-08-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  dispatchDate: string;

  @ApiProperty({
    description: 'Expected arrival date',
    example: '2023-08-10T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  expectedArrivalDate?: string;

  @ApiProperty({ description: 'Arrival date', example: '2023-08-15T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  arrivalDate?: string;

  @ApiProperty({
    description: 'Specific destination',
    enum: SpecificDestination,
  })
  @IsNotEmpty()
  @IsEnum(SpecificDestination)
  specificDestination: SpecificDestination;

  @ApiProperty({ description: 'Comments', example: 'Handle with care' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    description: 'Status',
    enum: Status,
  })
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
