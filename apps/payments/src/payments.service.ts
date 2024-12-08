import { NOTIFICATIONS_SERVICE } from "@app/common";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import Stripe from "stripe";
import { PaymentsCreateChargeDto } from "./dto/payments-create-charge.dto";
@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get<string>("STRIPE_SECRET_KEY"),
    {
      typescript: true,
      apiVersion: "2024-11-20.acacia",
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) { }
  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_mastercard" },
    });
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method: paymentMethod.id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    this.notificationsService.emit("notify_email", {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });
    return paymentIntent;
  }
}
