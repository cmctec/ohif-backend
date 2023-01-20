import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/supabase';
// https://github.com/prisma/prisma/issues/2443#issuecomment-630679118
@Injectable()
export class SupabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
   async onModuleInit() {
     await this.$connect();
   }
 
   async onModuleDestroy() {
     await this.$disconnect();
   }
 }