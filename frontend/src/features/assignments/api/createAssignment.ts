import { api } from '@/lib/axios';
import { type Assignment } from '../types';

export type CreateAssignmentDTO = {
    vesselId: string;
    positionId: string;
    principalId: string;
    signOnPort: string;
    signOnDate: string;
    signOffPort: string;
    signOffDate: string;
};

export const createAssignment = (data: CreateAssignmentDTO): Promise<Assignment> => {
    return api.post('/assignments', data);
};
