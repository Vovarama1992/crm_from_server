import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DealService } from './services/deal.service';
import { DealDto } from './types/deal.dto';
import { Deal } from '@prisma/client';

@Controller('deals')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post()
  async createDeal(@Body() createDealDto: DealDto): Promise<Deal> {
    return this.dealService.createDeal(createDealDto);
  }

  @Patch(':id')
  async updateDeal(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDealDto: Partial<DealDto>,
  ): Promise<Deal> {
    return this.dealService.updateDeal(id, updateDealDto);
  }

  @Get()
  async getAllDeals(): Promise<Deal[]> {
    return this.dealService.getAllDeals();
  }

  @Get('user/:userId')
  async getDealsByUser(@Param('userId') userId: number): Promise<Deal[]> {
    return this.dealService.getDealsByUser(userId);
  }

  @Get('department/:departmentId')
  async getDealsByDepartment(
    @Param('departmentId') departmentId: number,
  ): Promise<Deal[]> {
    return this.dealService.getDealsByDepartment(departmentId);
  }

  @Get('date-range')
  async getDealsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Deal[]> {
    return this.dealService.getDealsByDateRange(startDate, endDate);
  }

  @Get('monthly-turnover-and-margin')
  async getMonthlyTurnoverAndMargin(
    @Query('userId') userId: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.dealService.getMonthlyTurnoverAndMargin(userId, year, month);
  }

  @Get('all-users-monthly-turnover-and-margin')
  async getAllUsersMonthlyTurnoverAndMargin(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dealService.getAllUsersMonthlyTurnoverAndMargin(
      startDate,
      endDate,
    );
  }
}
