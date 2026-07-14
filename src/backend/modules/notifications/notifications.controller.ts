import { NotificationsService } from './notifications.service';
import { buildSuccessResponse } from '../../core/response/responseBuilder';
import { handleError } from '../../core/errors/errorHandler';

export class NotificationsController {
  private service: NotificationsService;

  constructor() {
    this.service = new NotificationsService();
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
