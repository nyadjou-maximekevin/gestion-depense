import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        // Fausse base de données : les tests unitaires ne touchent pas à Neon
        { provide: DataSource, useValue: { query: async () => [{ now: new Date() }] } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('renvoie le nom de l\'API', () => {
    expect(appController.getHello()).toBe('API Gestion de dépenses');
  });

  it('indique que la base est connectée', async () => {
    await expect(appController.health()).resolves.toMatchObject({ status: 'ok' });
  });
});
