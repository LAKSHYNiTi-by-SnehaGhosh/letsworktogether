import { InvoicesRepository } from './invoices.repository';

export class InvoicesService {
  private repository: InvoicesRepository;

  constructor() {
    this.repository = new InvoicesRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
