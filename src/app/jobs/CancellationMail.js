import Mail from '../../lib/Mail';

class CancelationMail {
  get key() {
    return 'CancellationgMail';
  }

  async handle({ data }) {
    const { deliveryProblemsExists } = data;

    await Mail.sendMail({
      to: `${deliveryProblemsExists.delivery.deliveryman.name}
      <${deliveryProblemsExists.delivery.deliveryman.email}>`,
      subject: 'Entrega Cancelada',
      template: 'cancellation',
      context: {
        nome: deliveryProblemsExists.delivery.deliveryman.name,
        produto: deliveryProblemsExists.delivery.product,
        Descricao: deliveryProblemsExists.description,
      },
    });
  }
}

export default new CancelationMail();
