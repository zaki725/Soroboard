import { useMemo, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { SelectOption } from '@/components/ui';
import type { UniversityResponseDto } from '@/types/university';
import type { FacultyResponseDto } from '@/types/faculty';
import { apiClient } from '@/libs/api-client';
import type { EducationalBackgroundFormData } from './useEducationalBackgroundManagement';

type UseEducationalBackgroundFormProps = {
  universities: UniversityResponseDto[];
};

export const useEducationalBackgroundForm = ({
  universities,
}: UseEducationalBackgroundFormProps) => {
  const { setValue, getValues, control } =
    useFormContext<EducationalBackgroundFormData>();
  const selectedUniversityId = useWatch({
    control,
    name: 'universityId',
  });
  const [faculties, setFaculties] = useState<FacultyResponseDto[]>([]);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);
  const [facultyFetchError, setFacultyFetchError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchFaculties = async () => {
      // watchとgetValuesの両方をチェックして、デフォルト値も含めて取得
      const universityId =
        selectedUniversityId || getValues('universityId') || '';

      if (!universityId || universityId === '') {
        setFaculties([]);
        setValue('facultyId', '');
        return;
      }

      try {
        setIsLoadingFaculties(true);
        setFacultyFetchError(null);
        const facultiesData = await apiClient<FacultyResponseDto[]>(
          `/universities/${universityId}/faculties`,
        );
        setFaculties(facultiesData ?? []);

        // デフォルト値の学部IDが新しい大学の学部リストに含まれているか確認
        const currentFacultyId = getValues('facultyId');
        if (currentFacultyId && currentFacultyId !== '') {
          const facultyExists = (facultiesData ?? []).some(
            (f) => f.id === currentFacultyId,
          );
          if (!facultyExists) {
            // 新しい大学の学部に該当学部がない場合はリセット
            setValue('facultyId', '');
          }
        }
      } catch {
        setFacultyFetchError('学部の取得に失敗しました');
        setFaculties([]);
        setValue('facultyId', '');
      } finally {
        setIsLoadingFaculties(false);
      }
    };

    void fetchFaculties();
  }, [selectedUniversityId, setValue, getValues]);

  const educationTypeOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '大学院', label: '大学院' },
      { value: '大学', label: '大学' },
      { value: '短期大学', label: '短期大学' },
      { value: '専門学校', label: '専門学校' },
      { value: '高等学校', label: '高等学校' },
      { value: 'その他', label: 'その他' },
    ];
  }, []);

  const universityOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '', label: '未選択' },
      ...universities.map((university) => ({
        value: university.id,
        label: university.name,
      })),
    ];
  }, [universities]);

  const facultyOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '', label: '未選択' },
      ...faculties.map((faculty) => ({
        value: faculty.id,
        label: faculty.name,
      })),
    ];
  }, [faculties]);

  const graduationYearOptions: SelectOption[] = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearCount = currentYear - 1950 + 1;
    return [
      { value: '', label: '未選択' },
      ...Array.from({ length: yearCount }, (_, i) => {
        const year = currentYear - i;
        return { value: year.toString(), label: `${year}年` };
      }),
    ];
  }, []);

  const graduationMonthOptions: SelectOption[] = useMemo(() => {
    return [
      { value: '', label: '未選択' },
      ...Array.from({ length: 12 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `${i + 1}月`,
      })),
    ];
  }, []);

  return {
    selectedUniversityId,
    faculties,
    isLoadingFaculties,
    facultyFetchError,
    educationTypeOptions,
    universityOptions,
    facultyOptions,
    graduationYearOptions,
    graduationMonthOptions,
  };
};
