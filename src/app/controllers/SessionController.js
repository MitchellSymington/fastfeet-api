import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfing from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return req.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Passwore does not match' });
    }

    const { id, name, avatar, deliveryman } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        deliveryman,
      },
      token: jwt.sign({ id }, authConfing.secret, {
        expiresIn: authConfing.expiresIn,
      }),
    });
  }
}

export default new SessionController();
