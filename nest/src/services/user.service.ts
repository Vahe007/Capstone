import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Document,
  Model,
  ObjectId,
  RootFilterQuery,
  Types,
  UpdateQuery,
} from 'mongoose';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { User, UserDocument } from 'src/schemas/user.schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async findById(id: string | Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(id).lean();
  }

  async findUserBy(query: RootFilterQuery<User>): Promise<User | null> {
    return this.userModel.findOne(query).lean();
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async updateUser(
    id: string | Types.ObjectId,
    {
      set = {},
      unset = [],
    }: {
      set?: Partial<User>;
      unset?: (keyof User)[];
    },
  ): Promise<User | null> {
    const updateQuery: any = {};

    if (Object.keys(set).length > 0) {
      updateQuery.$set = set;
    }

    if (unset.length > 0) {
      updateQuery.$unset = unset.reduce(
        (acc, key) => {
          acc[key] = '';
          return acc;
        },
        {} as Record<string, ''>,
      );
    }

    const user = this.userModel
      .findByIdAndUpdate(id, updateQuery, { new: true })
      .lean();

    return user;
  }

  // NOT USED
  // async updateUserById(
  //   id: string | Types.ObjectId,
  //   update: Partial<User>,
  // ): Promise<User | null> {
  //   return this.userModel.findByIdAndUpdate(id, update, { new: true }).lean();
  // }

  // NOT USED
  // async findAndUpdateWithDefaults(
  //   id: string | Types.ObjectId,
  //   updates: Partial<User>,
  // ): Promise<User | null> {
  //   const setOnInsert: any = {};
  //   const set: any = {};

  //   for (const [key, value] of Object.entries(updates)) {
  //     set[key] = value;
  //   }

  //   return this.userModel
  //     .findByIdAndUpdate(
  //       id,
  //       {
  //         $set: set,
  //       },
  //       {
  //         new: true,
  //         upsert: false,
  //       },
  //     )
  //     .lean();
  // }
}
