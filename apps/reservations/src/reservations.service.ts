import { Inject, Injectable } from "@nestjs/common";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { UpdateReservationDto } from "./dto/update-reservation.dto";
import { ReservationsRepository } from "./reservations.repository";
import { PAYMENTS_SERVICE, UserDto } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { map } from "rxjs";

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) { }
  async create(
    createReservationDto: CreateReservationDto,
    { _id: userId, email }: UserDto,
  ) {
    return this.paymentsService
      .send("create_charge", {
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map(async (response) => {
          return await this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: response.id,
            timeStamp: new Date(),
            userId,
          });
        }),
      );
  }

  async findAll() {
    return await this.reservationsRepository.find({});
  }

  async findOne(id: string) {
    return await this.reservationsRepository.findOne({ _id: id });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return await this.reservationsRepository.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateReservationDto,
      },
    );
  }

  async remove(id: string) {
    return await this.reservationsRepository.findOneAndDelete({
      _id: id,
    });
  }
}
