import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExpenseService } from './services/expense.service';
import { CreateExpenseDto } from './types/expense.dto';
import { Expense } from '@prisma/client';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expenseService.createExpense(createExpenseDto);
  }

  @Get()
  async getAllExpenses(): Promise<Expense[]> {
    return this.expenseService.getAllExpenses();
  }

  @Get('user/:userId')
  async getExpensesByUser(@Param('userId') userId: number): Promise<Expense[]> {
    return this.expenseService.getExpensesByUser(userId);
  }
}
