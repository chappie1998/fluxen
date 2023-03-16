import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { AuthValidator } from '../validators/auth-validator';
import { UpdateUserValidator } from '../validators/update-user.validator';
import * as jwt from 'jsonwebtoken';
import { hashMessage, Signer } from 'fuels';
import utils from 'ethers';

function recover_address(message: string, signature: string) {
  const hashedMessage = hashMessage(message);
  return Signer.recoverAddress(hashedMessage, signature).toB256();
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async updateUser({
    address,
    ...updateUser
  }: UpdateUserValidator): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ address }).exec();
    if (!user) throw new NotFoundException('User does not exists');
    this.userModel
      .findOneAndUpdate({ address }, updateUser, {
        timestamps: true,
      })
      .exec();
    return { message: 'User updated successfully' };
  }

  async validateUser(auth: AuthValidator): Promise<{ token: string }> {
    try {
      const address = recover_address(auth.message, auth.signature);
      if (address === auth.address) {
        this.userModel
          .findOneAndUpdate(
            { address: auth.address },
            { address: auth.address },
            {
              timestamps: true,
              upsert: true,
            },
          )
          .exec();
        return {
          token: jwt.sign(auth, 'thisisaprivatekey', {
            expiresIn: '90d',
          }),
        };
      }
    } catch (error) {}
    throw new BadRequestException('invalid singnature or addresss');
    // return {
    //   token: jwt.sign('lol', 'thisisaprivatekey', {
    //     expiresIn: '90d',
    //   }),
    // };
  }

  async getUser(address: string): Promise<User | null> {
    return this.userModel.findOne({
      address: address,
    });
  }
}
