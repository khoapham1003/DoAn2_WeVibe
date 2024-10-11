import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from '../dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from '../dto/update-order_detail.dto';
import { OrderDetail } from '../entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ORDER_STATUS } from 'src/shared/constants/order-status.const';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async create(
    createOrderDetailDto: CreateOrderDetailDto,
  ): Promise<OrderDetail> {
    const orderDetail = this.orderDetailRepository.create(
      createOrderDetailDto as unknown as DeepPartial<OrderDetail>,
    );
    return await this.orderDetailRepository.save(orderDetail);
  }

  async findAll(): Promise<OrderDetail[]> {
    return await this.orderDetailRepository.find();
  }

  async findOne(id: number): Promise<OrderDetail | null> {
    const orderDetail = await this.orderDetailRepository.findOneBy({
      mOrderDetailId: id,
    });
    if (!orderDetail) {
      throw new HttpException('Order Detail not found', HttpStatus.NOT_FOUND);
    }
    return orderDetail;
  }

  async update(
    id: number,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ): Promise<void> {
    updateOrderDetailDto.mModified = new Date().toISOString();
    const result = await this.orderDetailRepository.update(
      id,
      updateOrderDetailDto as unknown as Partial<OrderDetail>,
    );

    if (result.affected === 0) {
      throw new HttpException('Order Detail not found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(mOrderDetailId: number): Promise<void> {
    const orderDetail = await this.findOne(mOrderDetailId);
    if (!orderDetail) {
      throw new HttpException('Order Detail not found', HttpStatus.NOT_FOUND);
    }
    orderDetail.mStatus = ORDER_STATUS.CANCELLED;
    orderDetail.mModified = new Date().toISOString();
    await this.update(mOrderDetailId, this.toUpdateOrderDetailDto(orderDetail));
  }

  private toUpdateOrderDetailDto(
    orderDetail: OrderDetail,
  ): UpdateOrderDetailDto {
    const updateOrderDetailDto = new UpdateOrderDetailDto();
    updateOrderDetailDto.mProductId = orderDetail.mProductId.mProductId;
    updateOrderDetailDto.mQuantity = orderDetail.mQuantity;
    updateOrderDetailDto.mPrice = orderDetail.mPrice;
    updateOrderDetailDto.mStatus = orderDetail.mStatus;
    updateOrderDetailDto.mModified = orderDetail.mModified;
    return updateOrderDetailDto;
  }
}
