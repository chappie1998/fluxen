import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const { headers } = req;
      const headersInfo = JSON.parse(JSON.stringify(headers));
      const authToken: string = headersInfo.authorization;
      const token = authToken ? authToken.split(' ').pop() : '';
      if (!token) {
        throw new Error('Auth Token missing.');
      }
      jwt.verify(token, 'thisisaprivatekey');
      next();
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  }
}
