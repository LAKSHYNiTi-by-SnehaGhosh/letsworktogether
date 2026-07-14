import { AuthService } from './auth.service';
import { buildSuccessResponse } from '../../core/response/responseBuilder';
import { handleError } from '../../core/errors/errorHandler';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
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
