import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      deliveryman: Yup.boolean().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      deliveryman: Yup.boolean().required(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required().oneOf([Yup.ref('password')]) : field
        ),
      confirmPassword: Yup.string().when('Password', (password, field) =>
        password ? field.required : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExist = await User.findOne({
        where: { email },
      });

      if (userExist) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json('Password does not match');
    }

    await user.update(req.body);
    const { id, name, avatar } = await User.findByPk(req.userId);

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const users = User.findAll({
      where: { deliveryman: false },
      attributes: ['name', 'email'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(users);
  }

  async delete(req, res) {
    const { id } = req.params;

    await User.destroy({
      where: { id },
    });

    return res.json('sucess');
  }
}

export default new UserController();
