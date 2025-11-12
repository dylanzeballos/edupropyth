import { Inject, Injectable } from '@nestjs/common';
import { GROUP_REPOSITORY } from '../../../domain/interfaces/group-repository.interface';
import type { IGroupRepository } from '../../../domain/interfaces/group-repository.interface';

@Injectable()
export class DeleteGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY) private readonly groupRepo: IGroupRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.groupRepo.delete(id);
  }
}
