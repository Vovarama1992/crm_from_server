-- CreateEnum
CREATE TYPE "DealType" AS ENUM ('PURCHASE', 'SALE');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('INVOICE_SENT', 'QUOTE_SENT', 'LOST', 'WORKING_WITH_OBJECTIONS', 'DEAL_CLOSED', 'INVOICE_PAID');

-- CreateEnum
CREATE TYPE "LossReason" AS ENUM ('EXPENSIVE', 'OTHER', 'DID_NOT_WORK', 'NO_REPORT', 'EMPTY_TALK');

-- CreateEnum
CREATE TYPE "Destination" AS ENUM ('TO_CLIENT', 'TO_US', 'RETURN_FROM_CLIENT', 'RETURN_TO_SUPPLIER');

-- CreateEnum
CREATE TYPE "SpecificDestination" AS ENUM ('TO_TERMINAL', 'TO_DOOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SENT_ALL', 'SENT_PARTIALLY', 'DELIVERED_ALL', 'DELIVERED_PARTIALLY', 'PROBLEM');

-- CreateEnum
CREATE TYPE "DeliveryStage" AS ENUM ('PURCHASED_FOR_ORDER', 'IN_STOCK', 'ITEM_SENT', 'ITEM_DELIVERED_FULL', 'ITEM_DELIVERED_PARTIAL', 'RETURN');

-- CreateEnum
CREATE TYPE "SigningStage" AS ENUM ('SIGNED_IN_EDO', 'SIGNED_ON_PAPER');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "seenBy" INTEGER[],

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counterparty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "inn" TEXT NOT NULL,

    CONSTRAINT "Counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ropId" INTEGER,
    "quarterlyTurnoverPlan" DOUBLE PRECISION,
    "quarterlyProfitPlan" DOUBLE PRECISION,
    "yearlyProfitPlan" DOUBLE PRECISION,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" SERIAL NOT NULL,
    "counterpartyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "turnoverRub" DOUBLE PRECISION NOT NULL,
    "marginRub" DOUBLE PRECISION NOT NULL,
    "stage" "Stage" NOT NULL,
    "closeDate" TIMESTAMP(3),
    "lossReason" "LossReason",
    "comment" TEXT,
    "dealType" "DealType" NOT NULL,
    "purchaseId" INTEGER,
    "saleId" INTEGER,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departure" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER NOT NULL,
    "counterpartyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "destination" "Destination",
    "transportCompany" TEXT,
    "trackingNumber" TEXT NOT NULL,
    "finalAmount" DOUBLE PRECISION,
    "dispatchDate" TIMESTAMP(3) NOT NULL,
    "expectedArrivalDate" TIMESTAMP(3),
    "arrivalDate" TIMESTAMP(3),
    "specificDestination" "SpecificDestination" NOT NULL,
    "comments" TEXT,
    "status" "Status" NOT NULL,

    CONSTRAINT "Departure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "dobNumber" INTEGER,
    "cardNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mobile" TEXT NOT NULL,
    "hireDate" TEXT,
    "margin_percent" DOUBLE PRECISION,
    "managed_by" INTEGER,
    "address" TEXT,
    "department_id" INTEGER,
    "middleName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "position" TEXT,
    "roleName" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "quarterlyTurnoverPlan" DOUBLE PRECISION,
    "quarterlyProfitPlan" DOUBLE PRECISION,
    "yearlyProfitPlan" DOUBLE PRECISION,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiredUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "dobNumber" INTEGER,
    "cardNumber" TEXT,
    "mobile" TEXT NOT NULL,
    "fireDate" TEXT NOT NULL,
    "margin_percent" DOUBLE PRECISION,
    "managed_by" INTEGER,
    "address" TEXT,
    "department_id" INTEGER,
    "middleName" TEXT NOT NULL,
    "position" TEXT,
    "lastRoleName" TEXT NOT NULL,
    "lastRoleId" INTEGER NOT NULL,

    CONSTRAINT "FiredUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contragents" BOOLEAN NOT NULL,
    "summary_table" BOOLEAN NOT NULL,
    "departures" BOOLEAN NOT NULL,
    "salary_reports" BOOLEAN NOT NULL,
    "finances" BOOLEAN NOT NULL,
    "common_sales" BOOLEAN NOT NULL,
    "sales_list" BOOLEAN NOT NULL,
    "suppliers" BOOLEAN NOT NULL,
    "procurements" BOOLEAN NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dialogue" (
    "id" SERIAL NOT NULL,
    "context" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dialogue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "earned" DOUBLE PRECISION NOT NULL,
    "paid" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "expense" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dealId" INTEGER NOT NULL,
    "invoiceNumber" TEXT,
    "counterpartyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "logisticsCost" DOUBLE PRECISION DEFAULT 0,
    "purchaseCost" DOUBLE PRECISION DEFAULT 0,
    "saleAmount" DOUBLE PRECISION DEFAULT 0,
    "margin" DOUBLE PRECISION DEFAULT 0,
    "deliveryStage" "DeliveryStage" NOT NULL DEFAULT 'PURCHASED_FOR_ORDER',
    "signingStage" "SigningStage" NOT NULL DEFAULT 'SIGNED_IN_EDO',

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "dealId" INTEGER NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "counterpartyId" INTEGER NOT NULL,
    "invoiceToCustomer" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "deliveryDeadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "articleNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierLine" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "articleNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "supplierInvoice" TEXT NOT NULL,
    "totalPurchaseAmount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "shipmentDate" TIMESTAMP(3) NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "comment" TEXT,

    CONSTRAINT "SupplierLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsLine" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LogisticsLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Counterparty_inn_key" ON "Counterparty"("inn");

-- CreateIndex
CREATE UNIQUE INDEX "Department_ropId_key" ON "Department"("ropId");

-- CreateIndex
CREATE INDEX "Departure_dealId_idx" ON "Departure"("dealId");

-- CreateIndex
CREATE INDEX "Departure_counterpartyId_idx" ON "Departure"("counterpartyId");

-- CreateIndex
CREATE INDEX "Departure_userId_idx" ON "Departure"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FiredUser_email_key" ON "FiredUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Salary_userId_month_year_key" ON "Salary"("userId", "month", "year");

-- CreateIndex
CREATE INDEX "Expense_userId_idx" ON "Expense"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_dealId_key" ON "Sale"("dealId");

-- CreateIndex
CREATE INDEX "Sale_dealId_idx" ON "Sale"("dealId");

-- CreateIndex
CREATE INDEX "Sale_counterpartyId_idx" ON "Sale"("counterpartyId");

-- CreateIndex
CREATE INDEX "Sale_userId_idx" ON "Sale"("userId");

-- CreateIndex
CREATE INDEX "Purchase_dealId_idx" ON "Purchase"("dealId");

-- CreateIndex
CREATE INDEX "Purchase_counterpartyId_idx" ON "Purchase"("counterpartyId");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceLine_articleNumber_key" ON "InvoiceLine"("articleNumber");

-- CreateIndex
CREATE INDEX "InvoiceLine_purchaseId_idx" ON "InvoiceLine"("purchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierLine_articleNumber_key" ON "SupplierLine"("articleNumber");

-- CreateIndex
CREATE INDEX "SupplierLine_purchaseId_idx" ON "SupplierLine"("purchaseId");

-- CreateIndex
CREATE INDEX "SupplierLine_supplierId_idx" ON "SupplierLine"("supplierId");

-- CreateIndex
CREATE INDEX "LogisticsLine_purchaseId_idx" ON "LogisticsLine"("purchaseId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_ropId_fkey" FOREIGN KEY ("ropId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managed_by_fkey" FOREIGN KEY ("managed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceLine" ADD CONSTRAINT "InvoiceLine_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierLine" ADD CONSTRAINT "SupplierLine_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierLine" ADD CONSTRAINT "SupplierLine_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsLine" ADD CONSTRAINT "LogisticsLine_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
