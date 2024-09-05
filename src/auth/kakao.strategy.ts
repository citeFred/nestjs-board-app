import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const kakaoAccount = profile._json.kakao_account;
    const kakaoId = kakaoAccount.id;
    const kakaoUsername = kakaoAccount.name; // 'name'. 'displayName', 'nickName' 등 사용시 수정 필요
    return await this.authService.validateKakaoUser(kakaoId, kakaoUsername);
  }
}
