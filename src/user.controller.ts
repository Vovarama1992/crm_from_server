import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import { DepartmentService } from './services/deparment.service';
import { UserDto, CheckUserDto } from './types/user.dto';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PrismaService } from './services/prisma.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly departmentService: DepartmentService,
    private readonly mailerService: MailerService,
    private readonly prismaService: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Retrieve all departments' })
  @ApiResponse({ status: 200, description: 'List of all departments.' })
  @Get('departments')
  async getAllDepartments() {
    return this.departmentService.getDepartments();
  }

  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve all active users' })
  @ApiResponse({ status: 200, description: 'List of all active users.' })
  @Get('active')
  async findAllActive() {
    return this.userService.findAllActive();
  }

  @ApiOperation({ summary: 'Retrieve all fired users' })
  @ApiResponse({ status: 200, description: 'List of all fired users.' })
  @Get('fired')
  async findAllFired() {
    return this.userService.findAllFired();
  }

  @ApiOperation({ summary: 'Fire a user' })
  @ApiResponse({ status: 200, description: 'The user has been fired.' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiBearerAuth()
  @Patch('fire/:id')
  async fireUser(@Req() req: Request, @Param('id') id: string) {
    const decoded = this.authService.authenticate(req);
    if (decoded.roleName !== 'Директор') {
      throw new ForbiddenException(
        'Only Director have permission to fire a user',
      );
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.userService.fireUser(userId);
  }

  @ApiOperation({ summary: 'Restore a user' })
  @ApiResponse({ status: 200, description: 'The user has been restored.' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiBearerAuth()
  @Patch('restore/:id')
  async restoreUser(@Req() req: Request, @Param('id') id: string) {
    const decoded = this.authService.authenticate(req);
    if (decoded.roleName !== 'Директор') {
      throw new ForbiddenException(
        'Only Director have permission to restore a user',
      );
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.userService.restoreUser(userId);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiBody({ type: UserDto })
  @ApiBearerAuth()
  @Post('register')
  async register(@Req() req: Request, @Body() userDto: UserDto) {
    const decoded = this.authService.authenticate(req);
    if (decoded.roleName !== 'Директор') {
      throw new ForbiddenException(
        'Only Director have permission to register a new user',
      );
    }

    const { email, password, surname, department_id } = userDto;

    this.logger.log(`Received user data: ${JSON.stringify(userDto)}`);

    // Проверка наличия департамента
    if (department_id) {
      this.logger.log(`Checking department with id: ${department_id}`);
      const department = await this.prismaService.department.findFirst({
        where: { id: department_id },
      });
      if (!department) {
        this.logger.log(`Department not found. Creating new department`);
        // Создание нового департамента, если он не существует
        const newDepartment = await this.departmentService.createDepartment(
          'New Department',
          decoded.id,
        );
        this.logger.log(`New department created with id: ${newDepartment.id}`);
        userDto.department_id = newDepartment.id;
      }
    }

    this.logger.log('Sending registration email');
    await this.mailerService.sendMail({
      to: email,
      subject: `Ваши данные: email: ${email}, password: ${password}`,
      text: `Добро пожаловать на нашу платформу по адресу https://oldkns.webtm.ru`,
      template: './welcome',
      context: {
        name: surname,
        email: email,
        password: password,
      },
    });

    this.logger.log('Registering user');
    return this.userService.register(userDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
  })
  @ApiBody({ type: CheckUserDto })
  @Post('login')
  async login(@Body() checkUserDto: CheckUserDto) {
    return this.authService.login(checkUserDto);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @ApiBearerAuth()
  @Patch(':id')
  async updateUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateData: Partial<UserDto>,
  ) {
    const decoded = this.authService.authenticate(req);
    if (decoded.roleName !== 'Директор') {
      throw new ForbiddenException(
        'Only Director have permission to update a user',
      );
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.userService.updateUser(userId, updateData);
  }
  @ApiOperation({ summary: 'Get current user' })
  @ApiBearerAuth()
  @Get('me')
  async getUser(@Req() req: Request) {
    const decoded = this.authService.authenticate(req);
    const userId = parseInt(decoded.sub, 10);
    return this.userService.getUserById(userId);
  }

  @ApiOperation({ summary: 'Get information about user' })
  @ApiParam({ name: 'id', required: true, description: 'User ID' })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.userService.getUserById(userId);
  }

  @ApiOperation({ summary: 'Get information about users by surname' })
  @ApiParam({ name: 'surname', required: true, description: 'User Surname' })
  @Get('surname/:surname')
  async getUsersBySurname(@Param('surname') surname: string) {
    return this.userService.getUsersBySurname(surname);
  }

  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({
    status: 201,
    description: 'The department has been successfully created.',
  })
  @ApiBody({ schema: { example: { name: 'Sales', ropId: 1 } } })
  @ApiBearerAuth()
  @Post('departments')
  async createDepartment(
    @Req() req: Request,
    @Body('name') name: string,
    @Body('ropId') ropId: number,
  ) {
    const decoded = this.authService.authenticate(req);
    if (decoded.roleName !== 'Директор') {
      throw new ForbiddenException(
        'Only Director have permission to create a new department',
      );
    }

    return this.departmentService.createDepartment(name, ropId);
  }

  @ApiOperation({ summary: 'Update a department' })
  @ApiResponse({
    status: 200,
    description: 'The department has been successfully updated.',
  })
  @ApiParam({ name: 'id', required: true, description: 'Department ID' })
  @ApiBody({ schema: { example: { name: 'New Sales', ropId: 2 } } })
  @ApiBearerAuth()
  @Patch('departments/:id')
  async updateDepartment(
    @Req() req: Request,
    @Param('id') id: string,

    @Body('ropId') ropId: number,
  ) {
    const decoded = this.authService.authenticate(req);
    if (decoded.roleName !== 'Директор') {
      throw new ForbiddenException(
        'Only Director have permission to update a department',
      );
    }

    const departmentId = parseInt(id, 10);
    if (isNaN(departmentId)) {
      throw new BadRequestException('Invalid department ID');
    }

    return this.departmentService.updateDepartment(departmentId, ropId);
  }

  @ApiOperation({ summary: 'Delete a department' })
  @ApiResponse({
    status: 200,
    description: 'The department has been successfully deleted.',
  })
  @ApiParam({ name: 'id', required: true, description: 'Department ID' })
  @ApiBearerAuth()
  @Delete('departments/:id')
  async deleteDepartment(@Req() req: Request, @Param('id') id: string) {
    const decoded = this.authService.authenticate(req);
    if (decoded.roleName !== 'Директор') {
      throw new ForbiddenException(
        'Only Director have permission to delete a department',
      );
    }

    const departmentId = parseInt(id, 10);
    if (isNaN(departmentId)) {
      throw new BadRequestException('Invalid department ID');
    }

    return this.departmentService.deleteDepartment(departmentId);
  }
}
