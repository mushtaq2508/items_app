import { Entity, BaseEntity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from "mongodb";

@Entity("item")
export class Item {
  @ObjectIdColumn()
  id: ObjectId = new ObjectId();
  itemID?: number;

  @Column()
  name!: string;
}