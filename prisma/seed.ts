import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  await prisma.supplierLine.deleteMany({});
  await prisma.sale.deleteMany({});

  await prisma.logisticsLine.deleteMany({});

  await prisma.invoiceLine.deleteMany({});

  await prisma.purchase.deleteMany({});

  await prisma.departure.deleteMany({});

  await prisma.deal.deleteMany({});

  // Удаляем данные из таблицы users
  await prisma.user.deleteMany({});

  // Удаляем данные из таблицы roles
  await prisma.role.deleteMany({});

  const rolesData = [
    {
      name: 'Директор',
      contragents: true,
      summary_table: true,
      departures: true,
      salary_reports: true,
      finances: true,
      common_sales: true,
      sales_list: true,
      suppliers: true,
      procurements: true,
    },
    {
      name: 'Бухгалтер',
      contragents: true,
      summary_table: false,
      departures: true,
      salary_reports: true,
      finances: false,
      common_sales: false,
      sales_list: false,
      suppliers: false,
      procurements: false,
    },
    {
      name: 'РОП',
      contragents: true,
      summary_table: true,
      departures: true,
      salary_reports: true,
      finances: false,
      common_sales: false,
      sales_list: true,
      suppliers: false,
      procurements: false,
    },
    {
      name: 'Закупщик',
      contragents: true,
      summary_table: false,
      departures: true,
      salary_reports: false,
      finances: false,
      common_sales: false,
      sales_list: true,
      suppliers: true,
      procurements: true,
    },
    {
      name: 'Логист',
      contragents: true,
      summary_table: false,
      departures: true,
      salary_reports: false,
      finances: false,
      common_sales: false,
      sales_list: true,
      suppliers: false,
      procurements: false,
    },
    {
      name: 'Менеджер',
      contragents: true,
      summary_table: false,
      departures: true,
      salary_reports: false,
      finances: false,
      common_sales: false,
      sales_list: true,
      suppliers: false,
      procurements: false,
    },
    {
      name: 'Без роли',
      contragents: true,
      summary_table: false,
      departures: true,
      salary_reports: false,
      finances: false,
      common_sales: false,
      sales_list: false,
      suppliers: false,
      procurements: false,
    },
  ];

  for (const roleData of rolesData) {
    await prisma.role.create({
      data: roleData,
    });
  }

  // Найти роль "Директор"
  const directorRole = await prisma.role.findFirst({
    where: { name: 'Директор' },
  });

  if (directorRole) {
    // Хешированный пароль
    const hashedPassword =
      '$2a$10$fl9LiEF80FJMLNEA4v1xE.FlWXdY34qAygW6oI/s00Xo4fOMYv04K';

    // Добавляем пользователя с ролью "Директор"
    await prisma.user.create({
      data: {
        email: 'ivan.ivanov@example.com',
        password: hashedPassword,
        name: 'Иван',
        birthday: '1990-01-01',
        surname: 'Иванов',
        mobile: '+7 123 456-78-90',
        middleName: 'Петрович',
        roleName: 'Директор',
        roleId: directorRole.id,
      },
    });
  } else {
    console.error('Роль "Директор" не найдена');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
