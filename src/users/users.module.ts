import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UserService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule{}