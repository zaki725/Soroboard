'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrentDateToJST } from '@/libs/date-utils';
import { useTodayEvent } from '@/features/event-management/hooks/useTodayEvent';

export const HeaderDateAndRcdx = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const { todayEvent } = useTodayEvent();

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(formatCurrentDateToJST());
    };

    updateDate();
    const interval = setInterval(updateDate, 1000 * 60 * 60); // 1時間ごとに更新

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1 ml-2">
      <div className="flex items-center gap-3">
        {currentDate && (
          <span className="text-sm font-medium text-white">{currentDate}</span>
        )}
      </div>
      {todayEvent && (
        <div className="text-xs text-white">
          今日のイベント:{' '}
          <Link
            href={`/admin/event-management/${todayEvent.id}`}
            className="underline hover:no-underline"
          >
            {todayEvent.eventMasterName}
          </Link>
        </div>
      )}
    </div>
  );
};
