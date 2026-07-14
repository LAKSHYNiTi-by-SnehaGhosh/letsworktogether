import { ProfileService } from './profile.service';
import { buildSuccessResponse } from '../../core/response/responseBuilder';
import { handleError } from '../../core/errors/errorHandler';

export class ProfileController {
  private service: ProfileService;

  constructor() {
    this.service = new ProfileService();
  }

  async handle() {
    try {
      const result = await this.service.execute();
      return buildSuccessResponse(result);
    } catch (error) {
      return handleError(error);
    }
  }
}
