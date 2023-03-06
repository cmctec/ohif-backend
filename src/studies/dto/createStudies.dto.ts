class organizationsDto {
  institution_name: string;
}
class StudiesDto {
  ohif_id: string;
  description: string;
  access_number: string;
  date: string;
}
class PatientDto {
  iin: string;
  phone: string;
  email: string;
}
export class CreateStudiesDto {
  studies: StudiesDto;
  patient: PatientDto;
  organizations: organizationsDto;
  modalities: {
    name: string;
  }[];
}
