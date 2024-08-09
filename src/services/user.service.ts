import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserDto } from '../types/user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findAllActive() {
    return this.prisma.user.findMany({
      where: { isActive: true },
    });
  }

  async findAllFired() {
    return this.prisma.user.findMany({
      where: { isActive: false },
    });
  }

  async fireUser(userId: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        department_id: null,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return `User with ID ${userId} has been fired and removed from the department.`;
  }

  async restoreUser(userId: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return `User with ID ${userId} has been restored.`;
  }

  async register(userDto: UserDto) {
    this.logger.log('Starting user registration');
    const { email, password, roleName, ...rest } = userDto;

    if (!password) {
      this.logger.error('Password is required');
      throw new BadRequestException('Password is required');
    }

    this.logger.log(`Received password: ${password}`);

    try {
      this.logger.log('Checking if user already exists');
      const existingUser = await this.prisma.user.findUnique({
        where: { email: email },
      });
      if (existingUser) {
        this.logger.error('User already exists');
        throw new BadRequestException('User with this email already exists');
      }

      this.logger.log('Finding role');
      const role = await this.prisma.role.findFirst({
        where: { name: roleName },
      });
      if (!role) {
        this.logger.error('Role not found');
        throw new NotFoundException('Role not found');
      }

      this.logger.log('Hashing password');
      const hashedPassword = await bcrypt.hash(password, 10);

      this.logger.log('Preparing user data for creation');
      const data = {
        email,
        password: hashedPassword,
        roleName,
        roleId: role.id,
        address: rest.address ?? null,
        department_id: rest.department_id ?? null,
        position: rest.position ?? null,
        birthday: rest.birthday ?? null,
        dobNumber: rest.dobNumber ?? null,
        cardNumber: rest.cardNumber ?? null,
        mobile: rest.mobile,
        hireDate: rest.hireDate ?? null,
        margin_percent: rest.margin_percent ?? null,
        managed_by: rest.managed_by ?? null,
        name: rest.name,
        surname: rest.surname,
        middleName: rest.middleName,
        isActive: rest.isActive ?? true,
      };

      this.logger.log('Creating user in database with data:', data);
      const user = await this.prisma.user.create({ data });

      this.logger.log('User successfully created');
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        roleName: user.roleName,
        middleName: user.middleName,
      };
    } catch (error) {
      this.logger.error('Error during user registration', error.stack);
      throw error;
    }
  }

  async updateUser(userId: number, updateData: Partial<UserDto>) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const {
      contragents,
      summary_table,
      departures,
      salary_reports,
      finances,
      common_sales,
      sales_list,
      suppliers,
      procurements,
    } = user.role;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      roleName: user.roleName,
      middleName: user.middleName,
      address: user.address,
      department_id: user.department_id,
      position: user.position,
      permissions: {
        contragents,
        summary_table,
        departures,
        salary_reports,
        finances,
        common_sales,
        sales_list,
        suppliers,
        procurements,
      },
    };
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async getUsersBySurname(surname: string) {
    const users = await this.prisma.user.findMany({
      where: { surname },
      include: { role: true },
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    return users;
  }
}
