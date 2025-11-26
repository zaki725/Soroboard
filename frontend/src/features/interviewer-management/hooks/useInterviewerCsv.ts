import { useInterviewerCsvTemplate } from './useInterviewerCsvTemplate';
import { useInterviewerCsvUpload } from './useInterviewerCsvUpload';
import type { UserResponseDto } from '@/types/user';

type UseInterviewerCsvParams = {
  users: UserResponseDto[];
  fetchInterviewers: () => Promise<void>;
};

export const useInterviewerCsv = ({
  users,
  fetchInterviewers,
}: UseInterviewerCsvParams) => {
  const csvTemplate = useInterviewerCsvTemplate();
  const csvUpload = useInterviewerCsvUpload({ fetchInterviewers, users });

  return {
    ...csvTemplate,
    ...csvUpload,
  };
};
