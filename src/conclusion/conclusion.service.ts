import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';

@Injectable()
export class ConclusionService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllModalities (){
   return this.prismaService.modalities.findMany()
  } 
}
