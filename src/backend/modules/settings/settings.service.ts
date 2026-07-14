import { SettingsRepository } from './settings.repository';

export class SettingsService {
  private repository: SettingsRepository;

  constructor() {
    this.repository = new SettingsRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
