'use client';

type InterviewerStatsCardsProps = {
  acceptanceRate?: number;
  acceptanceCount?: number;
  inProcessCount?: number;
  monthlyContactCount?: number;
  monthlyContactGrowth?: string;
  inSelectionCount?: number;
  waitingForInterviewCount?: number;
};

export const InterviewerStatsCards = ({
  acceptanceRate = 75,
  acceptanceCount = 15,
  inProcessCount = 20,
  monthlyContactCount = 42,
  monthlyContactGrowth = '+12%',
  inSelectionCount = 8,
  waitingForInterviewCount = 3,
}: InterviewerStatsCardsProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">内定率</h2>
        <div className="text-3xl font-bold text-blue-600">
          {acceptanceRate}%
        </div>
        <p className="text-sm text-gray-600 mt-2">
          内定者: {acceptanceCount}名 / 選考中: {inProcessCount}名
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">今月の接触数</h2>
        <div className="text-3xl font-bold text-green-600">
          {monthlyContactCount}回
        </div>
        <p className="text-sm text-gray-600 mt-2">
          前月比: {monthlyContactGrowth}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">選考中</h2>
        <div className="text-3xl font-bold text-orange-600">
          {inSelectionCount}名
        </div>
        <p className="text-sm text-gray-600 mt-2">
          面接待ち: {waitingForInterviewCount}名
        </p>
      </div>
    </div>
  );
};
