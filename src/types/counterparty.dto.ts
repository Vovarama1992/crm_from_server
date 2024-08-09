import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCounterpartyDto {
  @ApiProperty({ description: 'Название контрагента', example: 'ООО Ромашка' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ИНН контрагента', example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  inn: string;
}

export class CounterpartyDto {
  @ApiProperty({ description: 'ID контрагента', example: 1 })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Название контрагента', example: 'ООО Ромашка' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'ИНН контрагента', example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  inn: string;
}
