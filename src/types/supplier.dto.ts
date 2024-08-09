import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class SupplierDto {
  @ApiProperty({ description: 'Supplier Name', example: 'ООО Поставщик' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Supplier Address', example: 'ул. Ленина, д. 1' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Supplier Phone', example: '+7 (999) 123-45-67' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Supplier Email',
    example: 'supplier@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Supplier Website',
    example: 'https://supplier.com',
  })
  @IsNotEmpty()
  @IsString()
  website: string;

  @ApiProperty({ description: 'Contact Person', example: 'Иван Иванов' })
  @IsNotEmpty()
  @IsString()
  contactPerson: string;

  @ApiProperty({
    description: 'Note',
    example: 'Some additional information',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
