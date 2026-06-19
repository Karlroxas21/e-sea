import { api } from '@/lib/axios';
import { type Assignment } from '../types';

export type CreateAssignmentDTO = {
    vesselId: string;
    vesselName: string;
    imoNumber: string;
    vesselType: string;
    position: string;
    signOnDate: string;
    signOffDate: string;
    signOnPort: string;
    signOffPort: string;
};

export const createAssignment = (data: CreateAssignmentDTO): Promise<Assignment> => {
    return api.post('/assignments', data);
};
