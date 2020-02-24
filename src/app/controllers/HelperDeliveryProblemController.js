import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class HelperDeliveryProblemController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const deliveryProblems = await DeliveryProblem.findByPk(id, {
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

export default new HelperDeliveryProblemController();
