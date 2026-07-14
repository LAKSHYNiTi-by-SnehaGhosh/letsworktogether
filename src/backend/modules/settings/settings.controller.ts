import { SettingsService } from './settings.service';
import { buildSuccessResponse } from '../../core/response/responseBuilder';
import { handleError } from '../../core/errors/errorHandler';

export class SettingsController {
  private service: SettingsService;

  constructor() {
    this.service = new SettingsService();
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
