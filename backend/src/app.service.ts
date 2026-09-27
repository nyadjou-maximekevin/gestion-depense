import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'API Gestion de dépenses';
  }

  async health() {
    const [{ now }] = await this.dataSource.query<{ now: Date }[]>('SELECT NOW() AS now');
    return { status: 'ok', database: 'connectée', heure: now };
  }
}
