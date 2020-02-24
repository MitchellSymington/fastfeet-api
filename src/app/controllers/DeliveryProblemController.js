import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';
import Deliveryman from '../models/User';
import CancellationMail from '../jobs/CancellationMail';

import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery_id = req.params.id;

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { description } = req.body;
    const { id } = req.params;

    const deliveryProblemsExists = await DeliveryProblem.findByPk(id, {
      attributes: ['id', 'description'],
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: ['id', 'product'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });

    if (!deliveryProblemsExists) {
      return res.status(400).json('Delivery Problem Id Not Exists');
    }

    const today = new Date();
    await deliveryProblemsExists.update({ description, canceled_at: today });

    /**
     * Envia Email de cancelamento
     */

    await Queue.add(CancellationMail.key, {
      deliveryProblemsExists,
    });

    return res.json({ deliveryProblemsExists });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveryProblems = await DeliveryProblem.findAll({
      attributes: ['description'],
      include: [
        {
          model: Order,
          as: 'delivery',
          attributes: ['product'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliveryProblems);
  }
}

export default new DeliveryProblemController();
