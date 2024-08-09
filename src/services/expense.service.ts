import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Expense } from '@prisma/client';
import { CreateExpenseDto } from 'src/types/expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async createExpense(data: CreateExpenseDto): Promise<Expense> {
    return this.prisma.expense.create({
      data: {
        ...data,
      },
    });
  }

  async getAllExpenses(): Promise<Expense[]> {
    return this.prisma.expense.findMany();
  }

  async getExpensesByUser(userId: number): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      where: { userId },
    });
  }
}
