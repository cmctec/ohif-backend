import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';


// is not Final
type xmlVal = { _attributes: { 'i:nil': boolean } } | { _text: string };

export class RpnDataDto {
  MainAddress: xmlVal;
  Phone: xmlVal;
  activeAttachment: any;
  birthDate: xmlVal;
  citizen: xmlVal;
  confirmRequestCA: xmlVal;
  deathDate: xmlVal;
  firstName: xmlVal;
  gbdflRecordId: xmlVal;
  hgbd: xmlVal;
  iin: xmlVal;
  isDel: xmlVal;
  isExistsDataOfDeath: xmlVal;
  isExistsOpenRequest: xmlVal;
  isExistsSomeActiveAttachment: xmlVal;
  lastAttachmentSV: any;
  lastName: xmlVal;
  national: xmlVal;
  oid: xmlVal;
  openRequestAttach: xmlVal;
  openRequestCA: xmlVal;
  parentId: xmlVal;
  passport: xmlVal;
  personID: xmlVal;
  personStatus: xmlVal;
  secondName: xmlVal;
  sex: xmlVal;
  sid: xmlVal;
  somePersonDataForDuplicate: xmlVal;
}
