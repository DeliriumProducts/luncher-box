import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from '.';
import { Product } from './Product';

@Entity()
export class OrderProducts {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column('integer')
  productAmount: number;
}
