import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Salary } from '@prisma/client';
import { CreateSalaryDto, UpdateSalaryDto } from 'src/types/salary.dto';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  async createSalary(data: CreateSalaryDto): Promise<Salary> {
    return this.prisma.salary.create({
      data: {
        userId: data.userId,
        month: data.month,
        year: data.year,
        salary: data.salary,
        earned: data.earned,
        paid: data.paid,
      },
    });
  }

  async getAllSalaries() {
    return this.prisma.salary.findMany({
      include: {
        user: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async updateSalary(id: number, data: UpdateSalaryDto): Promise<Salary> {
    return this.prisma.salary.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async getSalariesByUserId(userId: number) {
    return this.prisma.salary.findMany({
      where: { userId },
      include: {
        user: {
          include: {
            department: true,
          },
        },
      },
    });
  }

  async getSalariesByDepartmentId(departmentId: number) {
    return this.prisma.salary.findMany({
      where: {
        user: {
          department_id: departmentId,
        },
      },
      include: {
        user: {
          include: {
            department: true,
          },
        },
      },
    });
  }
}
