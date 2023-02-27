type updateConclusionAfterUpdatePatientDataDto = {
  id: string;
  phone?: string;
  iin?: string;
} & (
  | {
      phone: string;
    }
  | {
      iin: string;
    }
);
