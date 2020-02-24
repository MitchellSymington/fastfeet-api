import { Op } from 'sequelize';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const { deliveryman_id } = req.params;
    const { page = 1 } = req.query;

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id,
        [Op.or]: [{ end_date: null }, { canceled_at: null }],
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
    const { id } = req.params;
    const today = new Date();
    const hour = today.getHours();

    if (hour >= 8 && hour <= 18) {
      return res.status(400).json({
        error: 'Time available for pickup is between 8h and 18h',
      });
    }

    const orders = await Order.findAndCountAll({
      where: { id, start_date: today },
    });

    if (orders > 5) {
      return res.status(400).json({
        error: 'You cannot make more than 5 deliveries in a day',
      });
    }

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
      start_date: today,
    });

    return res.json(order);
  }
}

export default new DeliveryController();
