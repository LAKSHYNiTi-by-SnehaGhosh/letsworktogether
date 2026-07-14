import { ClientsRepository } from './clients.repository';

export class ClientsService {
  private repository: ClientsRepository;

  constructor() {
    this.repository = new ClientsRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
