import {
  IsCreditCard,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  exp_month: string;

  @IsNumber()
  exp_year: string;

  @IsCreditCard()
  number: string;
}
