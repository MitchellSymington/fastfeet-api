import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Nova Entrega Agendada',
      template: 'delivery',
      context: {
        name: order.deliveryman.name,
        deliveryman_id: order.deliveryman.id,
        produto: order.product,
        rua: order.recipient.rua,
        complemento: order.recipient.complemento,
        cep: order.recipient.cep,
      },
    });
  }
}

export default new DeliveryMail();
