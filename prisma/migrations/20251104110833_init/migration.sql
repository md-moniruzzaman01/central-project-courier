-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('REGULAR', 'MONTHLY');

-- CreateEnum
CREATE TYPE "CourierStatus" AS ENUM ('REGISTERED', 'PICKED_UP', 'AT_ORIGIN_HUB', 'IN_TRANSIT', 'ARRIVED_DESTINATION_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'HANDED_TO_THIRD_PARTY', 'CANCELLED', 'LOST', 'MISSING');

-- CreateEnum
CREATE TYPE "ThirdPartyCourier" AS ENUM ('NONE', 'DHL', 'FEDEX', 'UPS', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'MOBILE_PAYMENT', 'CARD', 'OTHER');

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL,
    "senderId" INTEGER,
    "receiverId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sender" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "type" "PartnerType" NOT NULL DEFAULT 'REGULAR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receiver" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "nationalId" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receiver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Courier" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER,
    "hawb" TEXT,
    "referenceCode" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pickupCost" DOUBLE PRECISION,
    "packingAndUnpackingCost" DOUBLE PRECISION,
    "hwabCost" DOUBLE PRECISION,
    "documentCost" DOUBLE PRECISION,
    "freightCost" DOUBLE PRECISION,
    "lebarCost" DOUBLE PRECISION,
    "taxCost" DOUBLE PRECISION,
    "dutyCost" DOUBLE PRECISION,
    "transportCost" DOUBLE PRECISION,
    "deliveryCost" DOUBLE PRECISION,
    "otherCost" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "estimatedCost" DOUBLE PRECISION,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "totalAmount" DOUBLE PRECISION,
    "paidAmount" DOUBLE PRECISION DEFAULT 0,
    "dueAmount" DOUBLE PRECISION DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "paymentNotes" TEXT,
    "thirdParty" "ThirdPartyCourier" NOT NULL DEFAULT 'NONE',
    "thirdPartyTrack" TEXT,
    "boxId" TEXT,
    "shipmentId" INTEGER,
    "deliveryConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "deliveredAt" TIMESTAMP(3),
    "receiverSignature" TEXT,
    "recipientNote" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "currentStatus" "CourierStatus" NOT NULL DEFAULT 'REGISTERED',
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Courier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "courierId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "declaredValue" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "quantity" INTEGER DEFAULT 1,
    "hsCode" TEXT,
    "sku" TEXT,
    "value" DOUBLE PRECISION,
    "totalValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Box" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "tenantId" TEXT,
    "shipmentId" INTEGER,
    "totalWeight" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Box_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT,
    "shipmentCode" TEXT NOT NULL,
    "originCountry" TEXT NOT NULL,
    "destinationCountry" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3),
    "arrivalDate" TIMESTAMP(3),
    "status" "CourierStatus" NOT NULL,
    "totalWeight" DOUBLE PRECISION,
    "totalPickupCost" DOUBLE PRECISION,
    "totalhwabCost" DOUBLE PRECISION,
    "totalpackingAndUnpackingCost" DOUBLE PRECISION,
    "totaldocumentCost" DOUBLE PRECISION,
    "totalFreightCost" DOUBLE PRECISION,
    "totalLebarCost" DOUBLE PRECISION,
    "totalTaxCost" DOUBLE PRECISION,
    "totalDutyCost" DOUBLE PRECISION,
    "totalDeliveryCost" DOUBLE PRECISION,
    "totalOtherCost" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "handledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourierStatusHistory" (
    "id" SERIAL NOT NULL,
    "courierId" INTEGER NOT NULL,
    "status" "CourierStatus" NOT NULL DEFAULT 'REGISTERED',
    "note" TEXT,
    "changedBy" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourierStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "type" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "senderId" INTEGER,
    "courierId" INTEGER,
    "shipmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "tenantId" TEXT,
    "referenceCode" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "transactionNote" TEXT,
    "senderId" INTEGER NOT NULL,
    "courierId" INTEGER,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_senderId_key" ON "Address"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_receiverId_key" ON "Address"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Sender_email_key" ON "Sender"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Courier_hawb_key" ON "Courier"("hawb");

-- CreateIndex
CREATE INDEX "Courier_senderId_idx" ON "Courier"("senderId");

-- CreateIndex
CREATE INDEX "Courier_receiverId_idx" ON "Courier"("receiverId");

-- CreateIndex
CREATE INDEX "Courier_tenantId_idx" ON "Courier"("tenantId");

-- CreateIndex
CREATE INDEX "Courier_currentStatus_idx" ON "Courier"("currentStatus");

-- CreateIndex
CREATE INDEX "Courier_hawb_idx" ON "Courier"("hawb");

-- CreateIndex
CREATE UNIQUE INDEX "Box_label_key" ON "Box"("label");

-- CreateIndex
CREATE INDEX "Box_tenantId_idx" ON "Box"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_shipmentCode_key" ON "Shipment"("shipmentCode");

-- CreateIndex
CREATE INDEX "Shipment_tenantId_idx" ON "Shipment"("tenantId");

-- CreateIndex
CREATE INDEX "Shipment_shipmentCode_idx" ON "Shipment"("shipmentCode");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_referenceCode_key" ON "Payment"("referenceCode");

-- CreateIndex
CREATE INDEX "Payment_senderId_idx" ON "Payment"("senderId");

-- CreateIndex
CREATE INDEX "Payment_courierId_idx" ON "Payment"("courierId");

-- CreateIndex
CREATE INDEX "Payment_tenantId_idx" ON "Payment"("tenantId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Sender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Receiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courier" ADD CONSTRAINT "Courier_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Sender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courier" ADD CONSTRAINT "Courier_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Receiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courier" ADD CONSTRAINT "Courier_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Courier" ADD CONSTRAINT "Courier_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "Courier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourierStatusHistory" ADD CONSTRAINT "CourierStatusHistory_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "Courier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Sender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "Courier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Sender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "Courier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
