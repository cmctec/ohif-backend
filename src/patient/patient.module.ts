import { Module } from '@nestjs/common';
import { PatientsController } from './patient.controller';
import { PatientService } from './patient.service';
import { RpnModule } from '../utilModules/rpn/rpn.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, RpnModule],
  controllers: [PatientsController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
