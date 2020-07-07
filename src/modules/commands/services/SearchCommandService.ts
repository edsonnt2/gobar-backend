import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICommandRepository from '../repositories/ICommandRepository';
import Command from '../infra/typeorm/entities/Command';

interface IRequest {
  business_id: string;
  search: string;
}

@injectable()
class SearchCommandService {
  constructor(
    @inject('CommandRepository')
    private commandRepository: ICommandRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({ business_id, search }: IRequest): Promise<Command[]> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const commands = await this.commandRepository.search({
      business_id,
      search,
    });

    return commands;
  }
}

export default SearchCommandService;
