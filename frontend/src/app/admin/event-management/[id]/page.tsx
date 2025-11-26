'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { EventDetail } from '@/features/event-management/components/detail/EventDetail';
import { Loading } from '@/components/ui';

function EventDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  usePageTitle('イベント詳細');

  if (!id) {
    return null;
  }

  return <EventDetail eventId={id} />;
}

export default function EventDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EventDetailContent />
    </Suspense>
  );
}
