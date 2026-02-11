import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "정부과제 판단 서비스",
  description: "정부과제 수행 가능성을 판단하는 AI 기반 서비스",
  keywords: ["정부과제", "과제판단", "AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Sidebar />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
