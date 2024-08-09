import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './services/supplier.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './services/purchase.service';
import { DealController } from './deal.controller';
import { DealService } from './services/deal.service';
import { CounterpartyService } from './services/counterparty.service';
import { CounterpartyController } from './counterparty.controller';
import { DepartureController } from './departure.controller';
import { DepartureService } from './services/departure.service';
import { SaleController } from './sale.controller';
import { SaleService } from './services/sale.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { DepartmentService } from './services/deparment.service';
import { SalaryController } from './salary.controller';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './services/expense.service';
import { SalaryService } from './services/salary.service';
import { PrismaService } from './services/prisma.service';
import { NotificationService } from './services/notification.service'; // Добавлен NotificationService
import { NotificationController } from './notification.controller'; // Добавлен NotificationController

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    UserController,
    NotificationController,
    DepartureController,
    CounterpartyController,
    PurchaseController,
    DealController,
    ExpenseController,
    SalaryController,
    SaleController,
    SupplierController,
  ], // Добавлен NotificationController
  providers: [
    UserService,
    PrismaService,
    ExpenseService,
    DepartmentService,
    SaleService,
    AuthService,
    CounterpartyService,
    PurchaseService,
    NotificationService,
    SupplierService,
    DealService,
    DepartureService,
    SalaryService, // Добавлен NotificationService
  ],
})
export class AppModule {}
