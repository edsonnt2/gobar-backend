import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateIngressService from '@modules/ingress/services/CreateIngressService';
import ListIngressService from '@modules/ingress/services/ListIngressService';
import DeleteIngressService from '@modules/ingress/services/DeleteIngressService';

export default class IngressControllers {
  public async create(req: Request, res: Response): Promise<Response> {
    const { description, consume, value } = req.body;

    const createIngressService = container.resolve(CreateIngressService);

    const ingress = await createIngressService.execute({
      business_id: req.business.id,
      description,
      consume,
      value,
    });

    return res.json(ingress);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const listIngressService = container.resolve(ListIngressService);

    const ingress = await listIngressService.execute({
      business_id: req.business.id,
    });

    return res.json(ingress);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteIngressService = container.resolve(DeleteIngressService);

    await deleteIngressService.execute({
      id,
      business_id: req.business.id,
    });

    return res.status(204).send();
  }
}
