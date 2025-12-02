'use client';

import { Title, PageContainer, Loading, Button } from '@/components/ui';
import { FormError } from '@/components/form';
import { useEventDetailPage } from '../../hooks/detail/useEventDetailPage';
import { EventBasicInfo } from './EventBasicInfo';
import { EventInterviewers } from './EventInterviewers';
import { EventStudents } from './EventStudents';

type EventDetailProps = {
  eventId: string;
};

export const EventDetail = ({ eventId }: EventDetailProps) => {
  const {
    event,
    isLoading,
    error,
    fetchEvent,
    interviewerOptions,
    handleBack,
  } = useEventDetailPage({ eventId });

  if (isLoading) {
    return (
      <PageContainer>
        <Title>イベント詳細</Title>
        <Loading />
      </PageContainer>
    );
  }

  if (error || !event) {
    return (
      <PageContainer>
        <Title>イベント詳細</Title>
        <FormError error={error || 'イベントが見つかりません'} />
        <div className="mt-4">
          <Button variant="outline" onClick={handleBack}>
            一覧に戻る
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <Title>イベント詳細</Title>
        <Button variant="outline" onClick={handleBack}>
          一覧に戻る
        </Button>
      </div>

      <div className="space-y-6 mt-6">
        <EventBasicInfo event={event} onUpdate={fetchEvent} />
        <EventInterviewers
          event={event}
          interviewerOptions={interviewerOptions}
          onUpdate={fetchEvent}
        />
        <EventStudents />
      </div>
    </PageContainer>
  );
};
