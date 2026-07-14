import { FilesRepository } from './files.repository';

export class FilesService {
  private repository: FilesRepository;

  constructor() {
    this.repository = new FilesRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
