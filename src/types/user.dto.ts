import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Matches,
  IsNumber,
  MinLength,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ description: "User's first name" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: "User's surname" })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({ description: "User's middle name" })
  @IsNotEmpty()
  @IsString()
  middleName: string;

  @ApiProperty({ description: "User's date of birth", example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiProperty({ description: "User's manager", example: 1 })
  @IsOptional()
  @IsDateString()
  managed_by?: number;

  @ApiProperty({ description: "User's date of birth number", example: 12345 })
  @IsOptional()
  @IsInt()
  dobNumber?: number;

  @ApiProperty({ description: "User's card number" })
  @IsOptional()
  @IsString()
  cardNumber?: string;

  @ApiProperty({ description: "User's mobile number" })
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @ApiProperty({ description: "User's hire date", example: '2023-01-01' })
  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @ApiProperty({ description: "User's margin percentage", example: 10.5 })
  @IsOptional()
  @IsNumber()
  margin_percent?: number;

  @ApiProperty({ description: "User's role name" })
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @ApiProperty({ description: "User's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    minLength: 8,
    pattern:
      '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @ApiProperty({ description: "User's address" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: "User's department ID" })
  @IsOptional()
  @IsInt()
  department_id?: number;

  @ApiProperty({ description: "User's position" })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ description: 'Is user active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CheckUserDto {
  @ApiProperty({ description: "User's email address" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
