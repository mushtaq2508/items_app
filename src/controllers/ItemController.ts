import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import { ItemService } from '../services/ItemService';
import { Item } from '../models/Item';
import { Producer, Kafka, Message } from 'kafkajs';

// Kafka producer configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

@JsonController('/items')
export class ItemController {
  @Inject()
  private itemService: ItemService;

  @Get('/')
  async getAllItems(): Promise<Item[]> {
    return await this.itemService.getAllItems();
  }

  @Get('/:id')
  async getItemById(@Param('id') itemID: number): Promise<Item | undefined> {
    return await this.itemService.getItemById(itemID);
  }

  @Post('/')
  async createItem(@Body() newItem: Item): Promise<Item> {
    const createdItem = await this.itemService.createItem(newItem);

    // Publish message to Kafka topic
    await producer.connect();
    await producer.send({
      topic: 'item-created',
      messages: [
        { value: JSON.stringify(createdItem) }
      ],
    });
    await producer.disconnect();

    return createdItem;
  }

  @Put('/:id')
  async updateItem(@Param('id') id: string, @Body() updatedItem: Item): Promise<Item | null> {
    const result = await this.itemService.updateItem(id, updatedItem);
    if (result) {
      // Publish message to Kafka topic
      await producer.connect();
      await producer.send({
        topic: 'item-updated',
        messages: [
          { value: JSON.stringify(result) }
        ],
      });
      await producer.disconnect();
    }
    return result;
  }

  @Delete('/:id')
  async deleteItem(@Param('id') id: string): Promise<void> {
    await this.itemService.deleteItem(id);

    // Publish message to Kafka topic
    await producer.connect();
    await producer.send({
      topic: 'item-deleted',
      messages: [
        { value: JSON.stringify({ id }) }
      ],
    });
    await producer.disconnect();
  }
}
