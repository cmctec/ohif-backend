import {
  appointment,
  conclusion,
  conclusion_image,
  patients,
  studies,
} from 'generated/prisma';

export type conclusionPrismaType = conclusion & {
  appointment: appointment[];
  studies: studies & {
    patients: patients;
  };
  conclusion_image: conclusion_image[];
};
