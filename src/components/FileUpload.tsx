'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ParsedDocument {
  text: string;
  numPages: number;
  info: {
    title?: string;
    author?: string;
    creationDate?: string;
  };
}

interface UploadResult {
  success: boolean;
  fileName: string;
  filePath: string;
  fileSize: number;
  parsed: ParsedDocument;
}

interface FileUploadProps {
  onUploadComplete?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function FileUpload({ onUploadComplete, onError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return 'PDF 파일만 업로드 가능합니다';
    }
    if (file.size > MAX_FILE_SIZE) {
      return '파일 크기는 10MB 이하여야 합니다';
    }
    return null;
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setStatus('error');
      onError?.(validationError);
      return;
    }

    setSelectedFile(file);
    setStatus('uploading');
    setProgress(0);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // XMLHttpRequest를 사용하여 진행률 추적
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              if (response.success) {
                resolve(response as UploadResult);
              } else {
                reject(new Error(response.error || '업로드 실패'));
              }
            } catch {
              reject(new Error('응답 파싱 실패'));
            }
          } else {
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.error || `HTTP 오류: ${xhr.status}`));
            } catch {
              reject(new Error(`HTTP 오류: ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('네트워크 오류'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      setUploadResult(result);
      setStatus('success');
      onUploadComplete?.(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : '업로드 중 오류 발생';
      setErrorMessage(message);
      setStatus('error');
      onError?.(message);
    }
  }, [validateFile, onUploadComplete, onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setSelectedFile(null);
    setUploadResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="w-full">
      {/* 드래그 앤 드롭 영역 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={status === 'idle' ? handleClick : undefined}
        className={`
          relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ease-out
          ${status === 'idle' ? 'cursor-pointer hover:border-primary-300 hover:bg-gray-50' : 'cursor-default'}
          ${isDragging ? 'border-primary-500 bg-primary-50 scale-[1.02] shadow-toss-lg' : ''}
          ${status === 'success' ? 'border-success-200 bg-success-50' : ''}
          ${status === 'error' ? 'border-danger-200 bg-danger-50' : ''}
          ${status === 'idle' && !isDragging ? 'border-gray-200' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* 상태별 UI */}
        {status === 'idle' && (
          <div className="flex flex-col items-center gap-5">
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300
              ${isDragging ? 'bg-primary-100' : 'bg-gray-100'}
            `}>
              <Upload className={`
                w-8 h-8 transition-colors duration-300
                ${isDragging ? 'text-primary-600' : 'text-gray-400'}
              `} />
            </div>
            <div>
              <p className="text-[17px] font-bold mb-2 text-gray-900">
                PDF 파일을 여기에 드롭하세요
              </p>
              <p className="text-[14px] text-gray-500">
                또는 클릭하여 파일 선택 (최대 10MB)
              </p>
            </div>
          </div>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-[14px] mb-2.5">
                <span className="font-medium truncate max-w-[200px] text-gray-700">{selectedFile?.name}</span>
                <span className="font-bold text-primary-600">{progress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300 ease-out bg-primary-500"
                  style={{ width: `${progress}%` }} />
              </div>
              <p className="text-[14px] mt-3 text-gray-500 font-medium">
                업로드 중... PDF를 분석하고 있습니다
              </p>
            </div>
          </div>
        )}

        {status === 'success' && uploadResult && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center animate-bounce-short">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <div>
              <p className="text-[18px] font-bold mb-2 text-gray-900">업로드 완료!</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-success-100 text-[14px] text-gray-700">
                <FileText className="w-4 h-4 text-success-500" />
                <span className="font-medium truncate max-w-[200px]">{uploadResult.fileName}</span>
              </div>
              <p className="text-[13px] mt-3 text-gray-500">
                {formatFileSize(uploadResult.fileSize)} · {uploadResult.parsed.numPages}페이지
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              다른 파일 업로드
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-danger-500" />
            </div>
            <div>
              <p className="text-[16px] font-bold mb-1 text-danger-600">업로드 실패</p>
              <p className="text-[14px] text-danger-500 max-w-sm mx-auto">{errorMessage}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[14px] font-medium text-danger-600 hover:bg-danger-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </button>
          </div>
        )}
      </div>

      {/* 파일 정보 표시 (성공 시) */}
      {status === 'success' && uploadResult?.parsed.info && (
        <div className="mt-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
          <h4 className="text-[14px] font-bold mb-4 text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            파일 메타데이터
          </h4>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
            {uploadResult.parsed.info.title && (
              <>
                <dt className="text-gray-500">제목</dt>
                <dd className="font-medium text-gray-900 truncate">{uploadResult.parsed.info.title}</dd>
              </>
            )}
            {uploadResult.parsed.info.author && (
              <>
                <dt className="text-gray-500">작성자</dt>
                <dd className="font-medium text-gray-900 truncate">{uploadResult.parsed.info.author}</dd>
              </>
            )}
            <dt className="text-gray-500">페이지 수</dt>
            <dd className="font-medium text-gray-900">{uploadResult.parsed.numPages}페이지</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
