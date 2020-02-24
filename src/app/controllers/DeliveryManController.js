import * as Yup from 'yup';
import DeliveryMan from '../models/User';
import File from '../models/File';

class DeliveryManController {
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const { name, email } = req.body;

    const deliveryMan = await DeliveryMan.findByPk(id, {
      attributes: ['id', 'name', 'email'],
    });

    if (email !== deliveryMan.email) {
      const deliveryManExist = await DeliveryMan.findOne({
        where: { email },
      });

      if (deliveryManExist) {
        return res.status(400).json({ error: 'Deliveryman already exists.' });
      }
    }

    await deliveryMan.update(req.body);

    return res.json({
      name,
      email,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveryMen = await DeliveryMan.findAll({
      where: { deliveryman: true },
      attributes: ['name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliveryMen);
  }
}

export default new DeliveryManController();
