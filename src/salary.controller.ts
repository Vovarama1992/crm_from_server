import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { SalaryService } from './services/salary.service';
import { UserService } from './services/user.service';
import { CreateSalaryDto, UpdateSalaryDto } from './types/salary.dto';
import { Salary } from '@prisma/client';

@Controller('salaries')
export class SalaryController {
  constructor(
    private readonly salaryService: SalaryService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createSalary(
    @Body() createSalaryDto: CreateSalaryDto,
  ): Promise<Salary> {
    return this.salaryService.createSalary(createSalaryDto);
  }

  @Get(':userId')
  async getUserSalaries(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Salary[]> {
    const user = await this.userService.getUserById(userId);
    const roleName = user.roleName;

    if (roleName === 'Директор' || roleName === 'Бухгалтер') {
      return this.salaryService.getAllSalaries();
    } else if (roleName === 'РОП') {
      return this.salaryService.getSalariesByDepartmentId(user.department_id);
    } else {
      return this.salaryService.getSalariesByUserId(userId);
    }
  }

  @Patch(':id')
  async updateSalary(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalaryDto: UpdateSalaryDto,
  ): Promise<Salary> {
    return this.salaryService.updateSalary(id, updateSalaryDto);
  }

  @Get('user/:userId')
  async getSalariesByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Salary[]> {
    return this.salaryService.getSalariesByUserId(userId);
  }

  @Get('department/:departmentId')
  async getSalariesByDepartmentId(
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ): Promise<Salary[]> {
    return this.salaryService.getSalariesByDepartmentId(departmentId);
  }
}
