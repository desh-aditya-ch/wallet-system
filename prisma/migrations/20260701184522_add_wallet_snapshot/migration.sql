-- CreateTable
CREATE TABLE "WalletSnapshot" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalletSnapshot_walletId_idx" ON "WalletSnapshot"("walletId");

-- AddForeignKey
ALTER TABLE "WalletSnapshot" ADD CONSTRAINT "WalletSnapshot_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
