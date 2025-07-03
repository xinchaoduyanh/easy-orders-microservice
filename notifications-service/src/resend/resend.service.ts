import { Injectable } from '@nestjs/common';
import { OrderDeliveredNotification } from 'microservice-shared/index';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOrderDeliveredEmail(data: OrderDeliveredNotification) {
    const userEmail = data.userEmail;
    const { orderId, orderDetails } = data;
    const productsList = orderDetails.products
      .map((p) => `<li>${p.name} x${p.quantity} - $${p.price}</li>`)
      .join('');
    console.log(productsList);
    const html = `
      <h2>Xin chào ${userEmail},</h2>
      <p>Đơn hàng <b>#${orderId}</b> của bạn đã được giao thành công!</p>
      <ul>${productsList}</ul>
      <p>Tổng tiền: <b>$${orderDetails.total}</b></p>
      <p>Cảm ơn bạn đã mua hàng!</p>
    `;
    await this.resend.emails.send({
      from: 'hihi@vuduyanh.id.vn',
      to: userEmail,
      subject: 'Đơn hàng của bạn đã được giao',
      html,
    });
    console.log(
      `[NOTI] Đã gửi email giao hàng tới ${userEmail} cho orderId=${data.orderId}`,
    );
  }
}
