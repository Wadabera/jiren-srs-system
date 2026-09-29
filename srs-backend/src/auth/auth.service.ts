import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password || ''))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user._id, role: user.role };
    
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(
      { ...payload, tokenType: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d',
      } as any,
    );

    await this.usersService.saveRefreshToken(user._id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: {
        username: user.username,
        role: user.role,
        fullname: user.fullname
      }
    };
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
    return { success: true, message: 'Logged out successfully' };
  }

  async refreshToken(refresh_token: string) {
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
      });

      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await bcrypt.compare(refresh_token, user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Refresh token expired or invalid');
      }

      const newPayload = { username: user.username, sub: user._id, role: user.role };
      const access_token = this.jwtService.sign(newPayload);

      return { access_token };
    } catch (error) {
      this.logger.error('Token refresh error', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}