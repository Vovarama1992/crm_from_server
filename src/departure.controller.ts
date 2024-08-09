import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { DepartureService } from './services/departure.service';
import { Departure } from '@prisma/client';
import { DepartureDto } from './types/departure.dto';
import { PartialType } from '@nestjs/mapped-types';

class UpdateDepartureDto extends PartialType(DepartureDto) {}

@Controller('departures')
export class DepartureController {
  constructor(private readonly departureService: DepartureService) {}

  @Post()
  async createDeparture(@Body() body: DepartureDto): Promise<Departure> {
    return this.departureService.createDeparture(body);
  }

  @Get()
  async getAllDepartures(): Promise<Departure[]> {
    return this.departureService.getAllDepartures();
  }

  @Get('user/:userId')
  async getDeparturesByUser(
    @Param('userId') userId: string,
  ): Promise<Departure[]> {
    return this.departureService.getDeparturesByUser(Number(userId));
  }

  @Patch(':id')
  async updateDeparture(
    @Param('id') id: string,
    @Body() body: UpdateDepartureDto,
  ): Promise<Departure> {
    return this.departureService.updateDeparture(Number(id), body);
  }
}
