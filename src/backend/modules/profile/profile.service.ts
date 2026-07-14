import { ProfileRepository } from './profile.repository';

export class ProfileService {
  private repository: ProfileRepository;

  constructor() {
    this.repository = new ProfileRepository();
  }

  async execute() {
    return { status: 'Not implemented' };
  }
}
