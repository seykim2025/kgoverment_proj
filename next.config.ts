import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 대용량 파일 업로드 처리를 위한 설정
  // 워크스페이스 루트 명시적 설정
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // 외부 패키지 설정 (pdf-parse가 서버에서만 실행되도록)
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
