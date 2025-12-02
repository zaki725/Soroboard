'use client';

import { Title, PageContainer, Table } from '@/components/ui';

const mockContactedStudents = [
  {
    id: '1',
    name: '山田 太郎',
    university: '東京大学',
    lastContactDate: '2024-01-20',
    contactCount: 5,
    status: 'interview',
  },
  {
    id: '2',
    name: '佐藤 花子',
    university: '京都大学',
    lastContactDate: '2024-01-18',
    contactCount: 3,
    status: 'offer',
  },
  {
    id: '3',
    name: '鈴木 次郎',
    university: '早稲田大学',
    lastContactDate: '2024-01-15',
    contactCount: 2,
    status: 'screening',
  },
];

const statusLabelMap: Record<string, string> = {
  applied: '応募済み',
  screening: '選考中',
  interview: '面接中',
  offer: '内定',
  rejected: '不採用',
};

export const MyPage = () => {
  const contactedColumns = [
    { key: 'name', label: '名前' },
    { key: 'university', label: '大学' },
    { key: 'lastContactDate', label: '最終接触日' },
    { key: 'contactCount', label: '接触回数' },
    {
      key: 'status',
      label: 'ステータス',
      render: (_value: unknown, row: { status: string }) => (
        <span>{statusLabelMap[row.status] || row.status}</span>
      ),
    },
  ];

  const contactedData = mockContactedStudents.map((student) => ({
    id: student.id,
    name: student.name,
    university: student.university,
    lastContactDate: student.lastContactDate,
    contactCount: student.contactCount,
    status: student.status,
  }));

  return (
    <PageContainer>
      <Title>マイページ</Title>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            接触したことのある学生一覧
          </h2>
          <Table
            columns={contactedColumns}
            data={contactedData}
            emptyMessage="接触した学生はいません"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">内定率</h2>
            <div className="text-3xl font-bold text-blue-600">75%</div>
            <p className="text-sm text-gray-600 mt-2">
              内定者: 15名 / 選考中: 20名
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">今月の接触数</h2>
            <div className="text-3xl font-bold text-green-600">42回</div>
            <p className="text-sm text-gray-600 mt-2">前月比: +12%</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">選考中</h2>
            <div className="text-3xl font-bold text-orange-600">8名</div>
            <p className="text-sm text-gray-600 mt-2">面接待ち: 3名</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">分析</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">大学別内定率</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">東京大学</span>
                  <span className="text-sm font-medium">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '80%' }}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">京都大学</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '70%' }}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">早稲田大学</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-2">接触頻度の推移</h3>
              <div className="h-32 bg-gray-50 rounded p-4 flex items-end justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-blue-600 rounded-t"
                    style={{ height: '60%' }}
                  />
                  <span className="text-xs mt-1">1月</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-blue-600 rounded-t"
                    style={{ height: '80%' }}
                  />
                  <span className="text-xs mt-1">2月</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-blue-600 rounded-t"
                    style={{ height: '75%' }}
                  />
                  <span className="text-xs mt-1">3月</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 bg-blue-600 rounded-t"
                    style={{ height: '90%' }}
                  />
                  <span className="text-xs mt-1">4月</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
