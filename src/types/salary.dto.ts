import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class CreateSalaryDto {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Month of the salary', example: 7 })
  @IsNotEmpty()
  @IsInt()
  month: number;

  @ApiProperty({ description: 'Year of the salary', example: 2023 })
  @IsNotEmpty()
  @IsInt()
  year: number;

  @ApiProperty({ description: 'Amount of the salary', example: 5000.0 })
  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @ApiProperty({ description: 'Amount earned', example: 4500.0 })
  @IsNotEmpty()
  @IsNumber()
  earned: number;

  @ApiProperty({ description: 'Amount paid', example: 4000.0 })
  @IsNotEmpty()
  @IsNumber()
  paid: number;
}

export class UpdateSalaryDto {
  @ApiProperty({
    description: 'Amount of the salary',
    example: 5000.0,
    required: false,
  })
  @IsNumber()
  salary?: number;

  @ApiProperty({
    description: 'Amount earned',
    example: 4500.0,
    required: false,
  })
  @IsNumber()
  earned?: number;

  @ApiProperty({ description: 'Amount paid', example: 4000.0, required: false })
  @IsNumber()
  paid?: number;
}
