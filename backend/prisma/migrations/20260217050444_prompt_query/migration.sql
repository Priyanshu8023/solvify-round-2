-- CreateTable
CREATE TABLE "PromptQuery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptQuery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PromptQuery" ADD CONSTRAINT "PromptQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
