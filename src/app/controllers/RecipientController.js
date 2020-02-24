import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      complemento: Yup.string().required(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { nome, rua, complemento, estado, cidade, cep } = req.body;

    const recipientExist = await Recipient.findOne({
      where: { nome, rua, complemento, estado, cidade, cep },
    });

    if (recipientExist) {
      return res.status(400).json({ error: 'Recipient already exists.' });
    }

    await Recipient.create(req.body);

    return res.json({
      nome,
      rua,
      complemento,
      estado,
      cidade,
      cep,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      rua: Yup.string(),
      complemento: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      cep: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const recipientExist = await Recipient.findOne({
      where: { id },
    });

    if (!recipientExist) {
      return res.status(400).json({ error: 'Recipient does not exists.' });
    }

    const {
      nome,
      rua,
      complemento,
      estado,
      cidade,
      cep,
    } = await recipientExist.update(req.body);

    return res.json({
      nome,
      rua,
      complemento,
      estado,
      cidade,
      cep,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const recipient = await Recipient.findAll({
      attributes: ['nome', 'rua', 'complemento', 'estado', 'cidade', 'cep'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(recipient);
  }
}

export default new RecipientController();
