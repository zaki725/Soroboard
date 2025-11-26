import { InterviewerResponseDto } from './interviewer.dto';

export class InterviewerListResponseDto {
  constructor({ interviewers }: { interviewers: InterviewerResponseDto[] }) {
    this.interviewers = interviewers;
  }

  interviewers: InterviewerResponseDto[];
}
