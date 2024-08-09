import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Name of the expense',
    example: 'Office Supplies',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Category of the expense', example: 'Office' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Subcategory of the expense',
    example: 'Stationery',
  })
  @IsNotEmpty()
  @IsString()
  subcategory: string;

  @ApiProperty({
    description: 'Date of the expense',
    example: '2023-08-01T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'ID of the user who made the expense',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Amount of the expense',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  expense: number;
}
