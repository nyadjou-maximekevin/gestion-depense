import { NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { Depense } from './depense.entity.js';
import { DepensesService } from './depenses.service.js';

describe('DepensesService', () => {
  let repo: Record<string, ReturnType<typeof vi.fn>>;
  let service: DepensesService;

  beforeEach(() => {
    repo = {
      find: vi.fn().mockResolvedValue([]),
      findOneBy: vi.fn(),
      create: vi.fn((data) => data),
      save: vi.fn(async (data) => ({ id: 'd1', ...data })),
      merge: vi.fn((cible, source) => ({ ...cible, ...source })),
      remove: vi.fn(),
    };
    service = new DepensesService(repo as unknown as Repository<Depense>);
  });

  it('rattache la dépense créée à l\'utilisateur connecté', async () => {
    await service.create('user-1', { montant: 10, categorie: 'Autre', date: '2026-09-01' });
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1' }));
  });

  it('filtre toujours la liste par utilisateur', async () => {
    await service.findAll('user-1', { du: '2026-09-01', au: '2026-09-30', categorie: 'Transport' });
    expect(repo.find).toHaveBeenCalledWith({
      where: { userId: 'user-1', date: Between('2026-09-01', '2026-09-30'), categorie: 'Transport' },
      order: { date: 'DESC', creeLe: 'DESC' },
    });
  });

  it('cherche une dépense par id ET utilisateur', async () => {
    repo.findOneBy.mockResolvedValue({ id: 'd1', userId: 'user-1' });
    await service.findOne('user-1', 'd1');
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'd1', userId: 'user-1' });
  });

  it('renvoie 404 pour la dépense d\'un autre utilisateur', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.update('user-2', 'd1', { montant: 1 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });
});
