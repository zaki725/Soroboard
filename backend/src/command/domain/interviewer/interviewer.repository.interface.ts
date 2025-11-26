import { InterviewerEntity } from './interviewer.entity';

export interface IInterviewerRepository {
  create(interviewer: InterviewerEntity): Promise<InterviewerEntity>;
  findOne({ userId }: { userId: string }): Promise<InterviewerEntity | null>;
  update(interviewer: InterviewerEntity): Promise<InterviewerEntity>;
  delete({ userId }: { userId: string }): Promise<void>;
}
