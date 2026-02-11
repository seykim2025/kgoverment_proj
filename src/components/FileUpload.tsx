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
        className="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200"
        style={{
          cursor: status === 'idle' ? 'pointer' : 'default',
          borderColor: status === 'success' ? 'var(--green-500)' :
            status === 'error' ? 'var(--red-500)' :
            (isDragging || status === 'uploading') ? 'var(--blue-500)' : 'var(--gray-300)',
          backgroundColor: status === 'success' ? 'var(--green-50)' :
            status === 'error' ? 'var(--red-50)' :
            (isDragging || status === 'uploading') ? 'var(--blue-50)' : 'transparent',
          transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        }}
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
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
              <Upload className="w-7 h-7" style={{ color: 'var(--blue-500)' }} />
            </div>
            <div>
              <p className="text-[14px] font-medium mb-1" style={{ color: 'var(--gray-800)' }}>
                PDF 파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-[13px]" style={{ color: 'var(--gray-500)' }}>
                최대 10MB까지 업로드 가능
              </p>
            </div>
          </div>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--blue-50)' }}>
              <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--blue-500)' }} />
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-[13px] mb-2">
                <span className="font-medium truncate max-w-[180px]" style={{ color: 'var(--gray-700)' }}>{selectedFile?.name}</span>
                <span className="font-semibold" style={{ color: 'var(--blue-500)' }}>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--gray-200)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, backgroundColor: 'var(--blue-500)' }} />
              </div>
              <p className="text-[13px] mt-3" style={{ color: 'var(--gray-500)' }}>
                업로드 중... PDF를 파싱하고 있습니다
              </p>
            </div>
          </div>
        )}

        {status === 'success' && uploadResult && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--green-50)' }}>
              <CheckCircle className="w-7 h-7" style={{ color: 'var(--green-500)' }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold mb-2" style={{ color: 'var(--green-700)' }}>업로드 완료!</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-[13px]"
                style={{ border: '1px solid var(--green-100)', color: 'var(--gray-700)' }}>
                <FileText className="w-4 h-4" style={{ color: 'var(--green-500)' }} />
                {uploadResult.fileName}
              </div>
              <p className="text-[12px] mt-2" style={{ color: 'var(--gray-500)' }}>
                {formatFileSize(uploadResult.fileSize)} · {uploadResult.parsed.numPages}페이지
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
              style={{ color: 'var(--gray-500)' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              다른 파일 업로드
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--red-50)' }}>
              <AlertCircle className="w-7 h-7" style={{ color: 'var(--red-500)' }} />
            </div>
            <div>
              <p className="text-[14px] font-semibold mb-1" style={{ color: 'var(--red-700)' }}>업로드 실패</p>
              <p className="text-[13px]" style={{ color: 'var(--red-600)' }}>{errorMessage}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
              style={{ color: 'var(--red-500)' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              다시 시도
            </button>
          </div>
        )}
      </div>

      {/* 파일 정보 표시 (성공 시) */}
      {status === 'success' && uploadResult?.parsed.info && (
        <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
          <h4 className="text-[13px] font-semibold mb-3" style={{ color: 'var(--gray-700)' }}>파일 정보</h4>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
            {uploadResult.parsed.info.title && (
              <>
                <dt style={{ color: 'var(--gray-500)' }}>제목</dt>
                <dd className="font-medium" style={{ color: 'var(--gray-700)' }}>{uploadResult.parsed.info.title}</dd>
              </>
            )}
            {uploadResult.parsed.info.author && (
              <>
                <dt style={{ color: 'var(--gray-500)' }}>작성자</dt>
                <dd className="font-medium" style={{ color: 'var(--gray-700)' }}>{uploadResult.parsed.info.author}</dd>
              </>
            )}
            <dt style={{ color: 'var(--gray-500)' }}>페이지 수</dt>
            <dd className="font-medium" style={{ color: 'var(--gray-700)' }}>{uploadResult.parsed.numPages}페이지</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
