import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateEntranceService from '@modules/entrance/services/CreateEntranceService';
import ListEntranceService from '@modules/entrance/services/ListEntranceService';
import DeleteEntranceService from '@modules/entrance/services/DeleteEntranceService';

export default class EntranceControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { description, consume, value } = req.body;

    const createEntranceService = container.resolve(CreateEntranceService);

    const entrance = await createEntranceService.execute({
      business_id: req.business.id,
      description,
      consume,
      value,
    });

    return res.json(entrance);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const listEntranceService = container.resolve(ListEntranceService);

    const entrance = await listEntranceService.execute({
      business_id: req.business.id,
    });

    return res.json(entrance);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteEntranceService = container.resolve(DeleteEntranceService);

    await deleteEntranceService.execute({
      id,
      business_id: req.business.id,
    });

    return res.status(204).send();
  }
}
