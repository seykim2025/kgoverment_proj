import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
    const dataPath = path.join(process.cwd(), 'local_data_dump.json')

    if (!fs.existsSync(dataPath)) {
        console.error('Error: local_data_dump.json not found')
        process.exit(1)
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8')
    const data = JSON.parse(rawData)

    console.log('Starting migration to production...')

    // 1. Migrate Company
    console.log(`Migrating companies: ${data.Company?.length || 0}`)
    for (const company of (data.Company || [])) {
        console.log(`Upserting company: ${company.companyName} (${company.businessNumber})`)
        await prisma.company.upsert({
            where: { businessNumber: company.businessNumber },
            update: {
                companyName: company.companyName,
                representativeName: company.representativeName,
                foundedDate: new Date(company.foundedDate),
                address: company.address,
                companyType: company.companyType,
                companyScale: company.companyScale,
                recentRevenue: company.recentRevenue,
                debtRatio: company.debtRatio,
                researcherCount: company.researcherCount,
                patentCount: company.patentCount,
                technologies: company.technologies,
                certifications: company.certifications,
            },
            create: {
                id: company.id,
                businessNumber: company.businessNumber,
                companyName: company.companyName,
                representativeName: company.representativeName,
                foundedDate: new Date(company.foundedDate),
                address: company.address,
                companyType: company.companyType,
                companyScale: company.companyScale,
                recentRevenue: company.recentRevenue,
                debtRatio: company.debtRatio,
                researcherCount: company.researcherCount,
                patentCount: company.patentCount,
                technologies: company.technologies,
                certifications: company.certifications,
            }
        })
    }

    // 2. Migrate ProjectHistory
    console.log(`Migrating project histories: ${data.ProjectHistory?.length || 0}`)
    for (const history of (data.ProjectHistory || [])) {
        console.log(`Upserting project history: ${history.projectName}`)
        await prisma.projectHistory.upsert({
            where: { id: history.id },
            update: {
                projectName: history.projectName,
                managingAgency: history.managingAgency,
                performPeriod: history.performPeriod,
                role: history.role,
                budget: history.budget,
                result: history.result,
                summary: history.summary,
                keywords: history.keywords,
                companyId: history.companyId,
            },
            create: {
                id: history.id,
                projectName: history.projectName,
                managingAgency: history.managingAgency,
                performPeriod: history.performPeriod,
                role: history.role,
                budget: history.budget,
                result: history.result,
                summary: history.summary,
                keywords: history.keywords,
                companyId: history.companyId,
            }
        })
    }

    // 3. Migrate Assessment
    console.log(`Migrating assessments: ${data.Assessment?.length || 0}`)
    for (const assessment of (data.Assessment || [])) {
        console.log(`Upserting assessment: ${assessment.noticeTitle}`)
        await prisma.assessment.upsert({
            where: { id: assessment.id },
            update: {
                noticeTitle: assessment.noticeTitle,
                noticeContent: assessment.noticeContent,
                pdfPath: assessment.pdfPath,
                eligibilityStatus: assessment.eligibilityStatus,
                eligibilityFailReason: assessment.eligibilityFailReason,
                quantitativeScore: assessment.quantitativeScore,
                quantitativeStrengths: assessment.quantitativeStrengths,
                quantitativeWeaknesses: assessment.quantitativeWeaknesses,
                qualitativeRelevanceScore: assessment.qualitativeRelevanceScore,
                qualitativeReasoning: assessment.qualitativeReasoning,
                qualitativeKeywords: assessment.qualitativeKeywords,
                trafficLight: assessment.trafficLight,
                summary: assessment.summary,
                rawAiResponse: assessment.rawAiResponse,
                companyId: assessment.companyId,
            },
            create: {
                id: assessment.id,
                noticeTitle: assessment.noticeTitle,
                noticeContent: assessment.noticeContent,
                pdfPath: assessment.pdfPath,
                eligibilityStatus: assessment.eligibilityStatus,
                eligibilityFailReason: assessment.eligibilityFailReason,
                quantitativeScore: assessment.quantitativeScore,
                quantitativeStrengths: assessment.quantitativeStrengths,
                quantitativeWeaknesses: assessment.quantitativeWeaknesses,
                qualitativeRelevanceScore: assessment.qualitativeRelevanceScore,
                qualitativeReasoning: assessment.qualitativeReasoning,
                qualitativeKeywords: assessment.qualitativeKeywords,
                trafficLight: assessment.trafficLight,
                summary: assessment.summary,
                rawAiResponse: assessment.rawAiResponse,
                companyId: assessment.companyId,
            }
        })
    }

    console.log('Migration completed successfully!')
}

main()
    .catch((e) => {
        console.error('Migration failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
