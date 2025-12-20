'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrentDateToJST } from '@/libs/date-utils';
// event-management機能は削除されたため、useTodayEventは使用しない
export const HeaderDateAndRcdx = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  // event-management機能は削除されたため、todayEventは使用しない
  const todayEvent = null;

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
      {/* event-management機能は削除されたため、今日のイベント表示は非表示 */}
    </div>
  );
};
