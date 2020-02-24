import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/User';
import File from '../models/File';
import DeliveryMail from '../jobs/DeliveryMail';

import Queue from '../../lib/Queue';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string().required(),
      deliveryman_id: Yup.string().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const orderExist = await Order.findOne({
      where: {
        recipient_id,
        deliveryman_id,
        product,
        canceled_at: null,
        end_date: null,
      },
    });

    if (orderExist) {
      return res.status(400).json({ error: 'Order already exists.' });
    }

    const { id } = await Order.create(req.body);

    const order = await Order.findByPk(id, {
      attributes: ['product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['nome', 'rua', 'complemento', 'estado', 'cidade', 'cep'],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    /**
     * Enviar e-mail para entregador avisando de nova encomenda
     */

    await Queue.add(DeliveryMail.key, {
      order,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.string(),
      deliveryman_id: Yup.string(),
      product: Yup.string().req,
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const orderExist = await Order.findByPk(id);

    if (!orderExist) {
      return res.status(400).json({ error: 'Delivery does not exists.' });
    }

    const order = await orderExist.update(req.body);

    const product = await Order.findByPk(order.id, {
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['nome', 'rua', 'complemento', 'estado', 'cidade', 'cep'],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(product);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const order = await Order.findAll({
      attributes: ['product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['nome', 'rua', 'complemento', 'estado', 'cidade', 'cep'],
        },
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;

    await Order.destroy({
      where: { id },
    });

    return res.json('sucess');
  }
}

export default new OrderController();
