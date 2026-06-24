import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,

    ){}

    async login(dto: LoginDto){
        const user = await this.usersService.findByEmail(dto.email);
        if(!user) throw new UnauthorizedException('Invalid credentials');
        
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if(!passwordMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = {sub: user.id, email: user.email, role: user.role};
        return{
            access_token: this.jwtService.sign(payload)
        };
    }
}