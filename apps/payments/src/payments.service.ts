import { CardDto, CreateChargeDto } from "@app/common";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get<string>("STRIPE_SECRET_KEY"),
    {
      typescript: true,
      apiVersion: "2024-11-20.acacia",
    },
  );

  constructor(private readonly configService: ConfigService) {}
  async createCharge({ amount }: CreateChargeDto) {
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
    return paymentIntent;
  }
}
