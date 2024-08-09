import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDepartments() {
    this.logger.log('Fetching all departments');
    return this.prisma.department.findMany({
      include: {
        rop: true,
        users: true,
      },
    });
  }

  async createDepartment(name: string, ropId: number) {
    this.logger.log(
      `Creating department with name: ${name}, managed by user id: ${ropId}`,
    );
    const rop = await this.prisma.user.findUnique({
      where: { id: ropId },
    });

    if (!rop) {
      this.logger.error(`ROP with id ${ropId} not found`);
      throw new NotFoundException('ROP not found');
    }

    const department = await this.prisma.department.create({
      data: {
        name,
        ropId,
      },
    });
    this.logger.log(`Department created with id: ${department.id}`);
    return department;
  }

  async updateDepartment(departmentId: number, ropId: number) {
    this.logger.log(
      `Updating department id: ${departmentId} with new ROP id: ${ropId}`,
    );
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      this.logger.error(`Department with id ${departmentId} not found`);
      throw new NotFoundException('Department not found');
    }

    const rop = await this.prisma.user.findUnique({
      where: { id: ropId },
    });

    if (!rop) {
      this.logger.error(`ROP with id ${ropId} not found`);
      throw new NotFoundException('ROP not found');
    }

    const updatedDepartment = await this.prisma.department.update({
      where: { id: departmentId },
      data: {
        ropId,
      },
    });
    this.logger.log(
      `Department id: ${departmentId} updated with new ROP id: ${ropId}`,
    );
    return updatedDepartment;
  }

  async deleteDepartment(departmentId: number) {
    this.logger.log(`Deleting department id: ${departmentId}`);
    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
      include: { users: true },
    });

    if (!department) {
      this.logger.error(`Department with id ${departmentId} not found`);
      throw new NotFoundException('Department not found');
    }

    // Обновление всех сотрудников, чтобы их department_id был null
    await this.prisma.user.updateMany({
      where: { department_id: departmentId },
      data: { department_id: null },
    });

    // Удаление отдела
    const deletedDepartment = await this.prisma.department.delete({
      where: { id: departmentId },
    });
    this.logger.log(`Department id: ${departmentId} deleted`);
    return deletedDepartment;
  }
}
