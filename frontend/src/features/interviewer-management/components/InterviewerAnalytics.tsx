'use client';

type UniversityAcceptanceRate = {
  name: string;
  rate: number;
};

type InterviewerAnalyticsProps = {
  universityAcceptanceRates?: UniversityAcceptanceRate[];
  contactFrequencyData?: Array<{ month: string; value: number }>;
};

export const InterviewerAnalytics = ({
  universityAcceptanceRates = [
    { name: '東京大学', rate: 80 },
    { name: '京都大学', rate: 70 },
    { name: '早稲田大学', rate: 65 },
  ],
  contactFrequencyData = [
    { month: '1月', value: 60 },
    { month: '2月', value: 80 },
    { month: '3月', value: 75 },
    { month: '4月', value: 90 },
  ],
}: InterviewerAnalyticsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">分析</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">大学別内定率</h3>
          {universityAcceptanceRates.map((university) => (
            <div key={university.name} className="space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{university.name}</span>
                <span className="text-sm font-medium">{university.rate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${university.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">接触頻度の推移</h3>
          <div className="h-32 bg-gray-50 rounded p-4 flex items-end justify-between">
            {contactFrequencyData.map((data) => (
              <div key={data.month} className="flex flex-col items-center">
                <div
                  className="w-8 bg-blue-600 rounded-t"
                  style={{ height: `${data.value}%` }}
                />
                <span className="text-xs mt-1">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
