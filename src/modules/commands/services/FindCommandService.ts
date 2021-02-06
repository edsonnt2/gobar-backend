import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import ICommandRepository from '../repositories/ICommandRepository';
import Command from '../infra/typeorm/entities/Command';

interface IRequest {
  business_id: string;
  number: number;
  closed?: boolean;
}

@injectable()
class ListCommandService {
  constructor(
    @inject('CommandRepository')
    private commandRepository: ICommandRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    number,
    closed,
  }: IRequest): Promise<Command> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const command = await this.commandRepository.findByNumber({
      number,
      business_id,
      closed,
    });

    if (!command) throw new AppError('Command not found at the Business');

    return command;
  }
}

export default ListCommandService;
