import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser, UserDocument } from "@app/common";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  async signin(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    const { password, ...userData } = user;
    response.send(userData);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern("authenticate")
  async authenticate(@Payload() data: any) {
    return data?.user;
  }
}
