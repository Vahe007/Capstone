import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { User } from 'src/schemas/user.schemas';

@Injectable()
export class UserService {
    constructor (@InjectModel(User.name) private userModel: Model<User>) {}

    async getUsers() {
        return this.userModel.find();
    }

    async createUser(createUserDto: CreateUserDto) {
        const newUser = await this.userModel.create(createUserDto)
        return newUser.save()
    }

    async getUserById(id: string) {
        return this.userModel.findById(id);
    }

    async deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.findByIdAndUpdate(id, updateUserDto);
    }
}
