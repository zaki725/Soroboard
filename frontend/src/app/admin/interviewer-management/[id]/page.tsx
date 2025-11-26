'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { InterviewerDetail } from '@/features/interviewer-management/components/InterviewerDetail';
import { Loading } from '@/components/ui';

function InterviewerDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  usePageTitle('面接官詳細');

  if (!id) {
    return null;
  }

  return <InterviewerDetail interviewerId={id} />;
}

export default function InterviewerDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <InterviewerDetailContent />
    </Suspense>
  );
}
