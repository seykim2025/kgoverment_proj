-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessNumber" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "representativeName" TEXT NOT NULL,
    "foundedDate" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "companyType" TEXT NOT NULL,
    "companyScale" TEXT NOT NULL,
    "recentRevenue" REAL,
    "debtRatio" REAL,
    "researcherCount" INTEGER,
    "patentCount" INTEGER,
    "technologies" TEXT,
    "certifications" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProjectHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectName" TEXT NOT NULL,
    "managingAgency" TEXT NOT NULL,
    "performPeriod" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "budget" REAL,
    "result" TEXT NOT NULL,
    "summary" TEXT,
    "keywords" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyId" TEXT NOT NULL,
    CONSTRAINT "ProjectHistory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noticeTitle" TEXT NOT NULL,
    "noticeContent" TEXT NOT NULL,
    "pdfPath" TEXT,
    "eligibilityStatus" TEXT NOT NULL,
    "eligibilityFailReason" TEXT,
    "quantitativeScore" REAL,
    "quantitativeStrengths" TEXT,
    "quantitativeWeaknesses" TEXT,
    "qualitativeRelevanceScore" REAL,
    "qualitativeReasoning" TEXT,
    "qualitativeKeywords" TEXT,
    "trafficLight" TEXT NOT NULL,
    "summary" TEXT,
    "rawAiResponse" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyId" TEXT NOT NULL,
    CONSTRAINT "Assessment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_businessNumber_key" ON "Company"("businessNumber");
