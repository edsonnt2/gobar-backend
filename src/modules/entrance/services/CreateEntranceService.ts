import { injectable, inject } from 'tsyringe';
import AppError from '@shared/error/AppError';
import IBusinessRepository from '@modules/business/repositories/IBusinessRepository';
import IEntranceRepository from '../repositories/IEntranceRepository';
import Entrance from '../infra/typeorm/entities/Entrance';
import ICreateEntranceDTO from '../Dtos/ICreateEntranceDTO';

@injectable()
class CreateEntranceService {
  constructor(
    @inject('EntranceRepository')
    private entranceRepository: IEntranceRepository,

    @inject('BusinessRepository')
    private businessRepository: IBusinessRepository,
  ) {}

  public async execute({
    business_id,
    description,
    value,
    consume,
  }: ICreateEntranceDTO): Promise<Entrance> {
    const business = await this.businessRepository.findById(business_id);

    if (!business) throw new AppError('Business not found');

    const hasDescription = await this.entranceRepository.findByDescription(
      description,
      business_id,
    );

    if (hasDescription)
      throw new AppError('Entrance description already registered');

    const entrance = await this.entranceRepository.create({
      business_id,
      description,
      value,
      consume,
    });

    return entrance;
  }
}

export default CreateEntranceService;
