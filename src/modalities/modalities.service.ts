import { Injectable } from '@nestjs/common';
import { da } from 'date-fns/locale';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { SupabaseService } from 'src/utilModules/supabase/supabase.service';

@Injectable()
export class ModalitiesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getAllModalities() {
    return this.prismaService.modalities.findMany();
  }
  async createModalitiesInStudy(data: { name: string }[], study_id: number) {
    const supabaseModalities = await Promise.all(
      data.map(async (item) => {
        if (item.name === '' && data.length === 1) {
          return await this.supabaseService.modalities.findFirst({
            where: { name: 'NO_MODALITY' },
          });
        }
        return await this.getOrcreateModalities(item.name);
      }),
    );
    const modality_study_data = supabaseModalities.map((item) => {
      return {
        study_id,
        modality_id: item.id,
      };
    });
    return await this.supabaseService.modality_study.createMany({
      data: modality_study_data,
    });
  }
  async getOrcreateModalities(name: string) {
    const data = await this.supabaseService.modalities.findFirst({
      where: { name },
    });
    if (data) {
      return data;
    } else {
      return await this.supabaseService.modalities.create({
        data: { name },
      });
    }
  }
  async createModalitiesArray(data: { name: string }[]) {
    return this.supabaseService.modalities.createMany({
      data: data,
    });
  }
}
