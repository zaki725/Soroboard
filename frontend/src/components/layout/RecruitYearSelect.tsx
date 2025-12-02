'use client';

import type { ChangeEvent } from 'react';
import { useRecruitYear } from '@/contexts/RecruitYearContext';
import { themeColors } from '@/constants/theme';
import { Select } from '@/components/ui';

export const RecruitYearSelect = () => {
  const {
    recruitYears,
    selectedRecruitYear,
    setSelectedRecruitYear,
    isLoading,
  } = useRecruitYear();

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const year = recruitYears.find(
      (y) => y.recruitYear === Number(event.target.value),
    );
    setSelectedRecruitYear(year || null);
  };

  if (isLoading || !selectedRecruitYear) {
    return <div className="text-sm">読み込み中...</div>;
  }

  return (
    <div className="w-48">
      <Select
        id="recruit-year-select"
        value={selectedRecruitYear.recruitYear}
        onChange={handleYearChange}
        options={recruitYears.map((year) => ({
          value: year.recruitYear,
          label: year.displayName,
        }))}
        className="bg-white text-gray-900"
        style={{
          borderColor: themeColors.border,
        }}
      />
    </div>
  );
};
