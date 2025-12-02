'use client';

import { useEffect, useState } from "react";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { ProjectList } from "@/components/layout/ProjectList";
import { ProjectDetail } from "@/components/layout/ProjectDetail";
import { FormContainer } from "@/components/layout/FormContainer";
import { DetailFormContainer } from "@/components/layout/DetailFormContainer";
import { ProjectFormContainer } from "@/components/layout/ProjectFormContainer";
import { ShareFormContainer } from "@/components/layout/ShareFormContainer";
import { LoginPage } from "@/components/auth/LoginPage";
import { ImportResourceSheet } from "@/components/layout/ImportResourceSheet";

export default function Home() {
  const { currentView } = useUiStore();
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    checkSession(); // Supabase 세션 체크
  }, [checkSession]);

  if (!isHydrated || isLoading) {
    return null; // 또는 로딩 스피너
  }

  return (
    <>
      {currentView === 'login' && <LoginPage />}
      {currentView === 'projectList' && <ProjectList />}
      {currentView === 'projectDetail' && <ProjectDetail />}

      {/* 전역 폼 컨테이너 */}
      <FormContainer />
      <DetailFormContainer />
      <ProjectFormContainer />
      <ShareFormContainer />
      <ImportResourceSheet />
    </>
  );
}
