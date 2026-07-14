import { AnalyticsService } from './analytics.service';
import { buildSuccessResponse } from '../../core/response/responseBuilder';
import { handleError } from '../../core/errors/errorHandler';

export class AnalyticsController {
  private service: AnalyticsService;

  constructor() {
    this.service = new AnalyticsService();
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
