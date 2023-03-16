import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftHistory, NftHistorySchema } from './schemas/nftHistory.schema';
import { NftList, NftListSchema } from './schemas/nftList.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
import {
  CollectionDetail,
  CollectionDetailSchema,
} from './schemas/collectionDetails.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://marketplaceMongoDB:Marketplace@cluster0.in8ppbx.mongodb.net/marketplace_indexer?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: NftList.name, schema: NftListSchema, collection: 'nft_list' },
      {
        name: NftHistory.name,
        schema: NftHistorySchema,
        collection: 'nft_history',
      },
      {
        name: CollectionDetail.name,
        schema: CollectionDetailSchema,
        collection: 'collection_detail',
      },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('user/update');
  }
}
