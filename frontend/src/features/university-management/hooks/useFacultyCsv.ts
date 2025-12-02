import { useFacultyCsvTemplate } from './useFacultyCsvTemplate';
import { useFacultyCsvUpload } from './useFacultyCsvUpload';

type UseFacultyCsvParams = {
  universityId: string;
  fetchFaculties: () => Promise<void>;
};

export const useFacultyCsv = ({
  universityId,
  fetchFaculties,
}: UseFacultyCsvParams) => {
  const csvTemplate = useFacultyCsvTemplate({ universityId });
  const csvUpload = useFacultyCsvUpload({ universityId, fetchFaculties });

  return {
    ...csvTemplate,
    ...csvUpload,
  };
};
