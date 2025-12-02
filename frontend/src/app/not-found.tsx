'use client';

import { Button, PageContainer } from '@/components/ui';

export default function NotFound() {
  const handleGoHome = () => {
    // これで強制的にリロードがかかり、Contextも再初期化されます
    window.location.href = '/';
  };
  return (
    <PageContainer className="flex items-center justify-center">
      <div className="text-center w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-8xl font-bold text-gray-400 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            ページが見つかりません
          </h2>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-600">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>
        </div>

        <Button
          variant="primary"
          className="w-full max-w-xs"
          onClick={handleGoHome}
        >
          ホームに戻る
        </Button>
      </div>
    </PageContainer>
  );
}
