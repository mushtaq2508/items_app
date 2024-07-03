import "reflect-metadata";
import { DataSource } from "typeorm";
import { Item } from "../models/Item";

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: "mongodb+srv://mushtaqahamed8996:AtKhVtFHgcKykAwZ@mushtaq.axcuxbt.mongodb.net/?retryWrites=true&w=majority&appName=mushtaq",
  useNewUrlParser: true,
  synchronize: true,
  logging: true,
  entities: [Item]
});