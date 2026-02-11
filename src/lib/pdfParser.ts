/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import { pathToFileURL } from 'url';
import { getDocument, GlobalWorkerOptions, VerbosityLevel } from 'pdfjs-dist/legacy/build/pdf.mjs';

// fake worker가 dynamic import(workerSrc)를 실행하므로 file:// URL 필요 (Windows 호환)
GlobalWorkerOptions.workerSrc = pathToFileURL(
  path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
).href;

export interface ParsedDocument {
  text: string;
  numPages: number;
  info: {
    title?: string;
    author?: string;
    creationDate?: string;
  };
}

/**
 * PDF 파일을 파싱하여 텍스트와 메타데이터를 추출합니다.
 * pdfjs-dist를 직접 사용하여 Next.js 서버 환경 호환성을 보장합니다.
 */
export async function parsePDF(buffer: Buffer): Promise<ParsedDocument> {
  const data = new Uint8Array(buffer);

  const doc = await getDocument({
    data,
    verbosity: VerbosityLevel.ERRORS,
    useSystemFonts: true,
    disableFontFace: true,
    isEvalSupported: false,
  }).promise;

  // 텍스트 추출
  const textParts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .reduce((acc: string[], item: any) => {
        if ('str' in item) {
          acc.push(item.hasEOL ? item.str + '\n' : item.str);
        }
        return acc;
      }, [])
      .join('');
    textParts.push(pageText);
    page.cleanup();
  }

  // 메타데이터 추출
  // PDF 메타데이터의 한글은 인코딩 문제(PDFDocEncoding)로 깨지는 경우가 매우 많으므로
  // 제목/작성자는 본문에서 추출하고, 날짜만 메타데이터에서 가져옴.
  let creationDate: string | undefined;

  try {
    const metadata = await doc.getMetadata();
    const info = metadata?.info as Record<string, unknown> | undefined;
    if (info) {
      const rawDate = info.CreationDate;
      if (rawDate instanceof Date) {
        creationDate = rawDate.toISOString();
      } else if (typeof rawDate === 'string') {
        creationDate = rawDate;
      }
    }
  } catch {
    // 메타데이터가 없는 PDF의 경우 무시
  }

  // 제목은 본문 첫 페이지에서 추출
  const title = extractTitleFromText(textParts[0] ?? '');

  const numPages = doc.numPages;
  await doc.destroy();

  return {
    text: cleanText(textParts.join('\n\n')),
    numPages,
    info: { title, creationDate },
  };
}

/**
 * 본문 첫 부분에서 제목을 추출합니다.
 * 공고문의 경우 첫 몇 줄에 과제명/사업명이 포함되어 있는 경우가 많습니다.
 */
function extractTitleFromText(firstPageText: string): string | undefined {
  if (!firstPageText) return undefined;

  // 과제명/사업명 패턴 매칭 시도
  const titlePatterns = [
    /(?:과제명|사업명|공고명)[:\s]*([^\n]+)/i,
    /(?:공\s*고\s*문)[:\s]*([^\n]+)/i,
  ];
  for (const pattern of titlePatterns) {
    const match = firstPageText.match(pattern);
    if (match?.[1]) {
      const extracted = match[1].trim();
      if (extracted.length > 2 && extracted.length < 200) return extracted;
    }
  }

  // 패턴 매칭 실패 시 비어있지 않은 첫 번째 줄 사용 (50자 이내)
  const lines = firstPageText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines[0] && lines[0].length <= 50) {
    return lines[0];
  }

  return undefined;
}

/**
 * PDF 텍스트를 정리합니다.
 * - 연속 공백 제거
 * - 탭 등을 공백으로 변환
 * - 줄바꿈 정리
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')           // CRLF를 LF로 통일
    .replace(/\t/g, ' ')              // 탭을 공백으로
    .replace(/[^\S\n]+/g, ' ')        // 줄바꿈 제외 연속 공백 제거
    .replace(/\n{3,}/g, '\n\n')       // 3줄 이상 빈 줄을 2줄로
    .trim();
}

/**
 * 파싱된 텍스트에서 주요 섹션을 추출합니다.
 * 정부과제 공고문에서 자주 나타나는 섹션들을 찾습니다.
 */
export function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // 일반적인 정부과제 공고문 섹션 패턴
  const sectionPatterns = [
    { key: '과제명', pattern: /(?:과제명|사업명)[:\s]*([^\n]+)/i },
    { key: '예산규모', pattern: /(?:예산|총\s*사업비|지원\s*규모)[:\s]*([^\n]+)/i },
    { key: '수행기간', pattern: /(?:수행\s*기간|사업\s*기간|과제\s*기간)[:\s]*([^\n]+)/i },
    { key: '신청자격', pattern: /(?:신청\s*자격|참여\s*자격|지원\s*자격)[:\s]*([^\n]+)/i },
    { key: '접수기간', pattern: /(?:접수\s*기간|신청\s*기간|모집\s*기간)[:\s]*([^\n]+)/i },
  ];
  
  for (const { key, pattern } of sectionPatterns) {
    const match = text.match(pattern);
    if (match) {
      sections[key] = match[1].trim();
    }
  }
  
  return sections;
}

/**
 * 텍스트 미리보기를 생성합니다.
 */
export function getTextPreview(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}
