import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { SupabaseService } from 'src/utilModules/supabase/supabase.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}
  private readonly logger = new Logger();
  // TO DO Create Dto
  async getOrCreateOrganizations(data: { institution_name: string }) {
    const supabaseOrganizations =
      await this.supabaseService.organizations.findFirst({
        where: {
          institution_name: data.institution_name,
        },
      });
    if (supabaseOrganizations) return supabaseOrganizations;
    return await this.createOrganizations(data);
  }
  async createOrganizations(data: { institution_name: string }) {
    return await this.supabaseService.organizations.create({
      data: {
        institution_name: data.institution_name,
        name: data.institution_name,
      },
    });
  }
}
