import { Op } from 'sequelize';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class HelperDeliveryController {
  async index(req, res) {
    const { deliveryman_id } = req.params;
    const { page = 1 } = req.query;

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id,
        end_date: { [Op.ne]: null },
      },
      attributes: ['product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['nome', 'rua', 'complemnto', 'estado', 'cidade', 'cep'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(deliveries);
  }

  async update(req, res) {
    const { id, signature_id } = req.params;
    const today = new Date();

    const order = await Order.findByPk(id, {
      attributes: ['product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['nome', 'rua', 'complemnto', 'estado', 'cidade', 'cep'],
        },
      ],
    });

    await order.update({
      end_date: today,
      signature_id,
    });

    return res.json(order);
  }
}

export default new HelperDeliveryController();
