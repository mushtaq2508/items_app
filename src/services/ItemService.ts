import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { AppDataSource } from "../db/data-source";
import { Item } from '../models/Item';

@Service()
export class ItemService {
  private itemRepository: Repository<Item>;

  constructor() {
    this.itemRepository = AppDataSource.getRepository(Item);
  }

  async getAllItems(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  async getItemById(itemID: number): Promise<Item | undefined> {
    return await this.itemRepository.findOneBy({
      itemID: itemID as any
    });
  }

  async createItem(newItem: Item): Promise<Item> {
    return await this.itemRepository.save(newItem);
  }

  async updateItem(itemID: string, updatedItem: Item): Promise<Item | null> {
    const existingItem = await this.itemRepository.findOneBy({itemID: itemID as any});
    if (!existingItem) {
      return null;
    }
    const mergedItem = this.itemRepository.merge(existingItem, updatedItem);
    return await this.itemRepository.save(mergedItem);
  }

  async deleteItem(id: string): Promise<void> {
    await this.itemRepository.delete(id);
  }
}