import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BootstrapDto } from './dto/bootstrap.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Inscription utilisateur' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('bootstrap')
  @ApiOperation({ summary: "Créer le premier compte administrateur (désactivé dès qu'un utilisateur existe)" })
  bootstrap(@Body() dto: BootstrapDto) {
    return this.authService.bootstrap(dto);
  }
}
