import 'reflect-metadata';
import express from 'express';
import { useExpressServer } from 'routing-controllers';
import { createConnection } from 'typeorm';
import { ItemController } from './controllers/ItemController';
import producer from './kafkaProducer';

const PORT = 3000;

// Initialize Express server
const app = express();

// Use routing-controllers to handle routes
useExpressServer(app, {
  controllers: [ItemController]
});

// TypeORM connection
createConnection()
  .then(() => {
    console.log('Connected to MongoDB via TypeORM');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error('TypeORM connection error:', error));

// Initialize Kafka producer
producer.connect()
  .then(() => {
    console.log('Kafka producer connected');
  })
  .catch(error => console.error('Kafka producer connection error:', error));
