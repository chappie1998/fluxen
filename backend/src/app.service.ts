import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { NftListDto } from './dtos/nftList.dto';
import { NftList, NftListDocument } from './schemas/nftList.schema';
import { NftHistory, NftHistoryDocument } from './schemas/nftHistory.schema';
import {
  CollectionDetail,
  CollectionDetailDocument,
} from './schemas/collectionDetails.schema';
import { CollectionDetailsDto } from './dtos/collectionDetails.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(NftList.name) private nftListModel: Model<NftListDocument>,
    @InjectModel(NftHistory.name)
    private NftHistoryModel: Model<NftHistoryDocument>,
    @InjectModel(CollectionDetail.name)
    private CollectionDetailModel: Model<CollectionDetailDocument>,
  ) {}

  async getAllNft(
    body: NftListDto,
  ): Promise<{ total_count: number; data: NftList[] }> {
    let sortConditions: Record<string, SortOrder> = { block_height: -1 };
    const filterConditions: Record<string, unknown> = { nft_contract: body.id };
    if (body.attributes && body.attributes.length) {
      filterConditions['nft_data.attributes'] = { $in: body.attributes };
    }
    if (body.status) filterConditions.status = body.status;
    let priceRange = {};
    if (body.min_price) priceRange = { ...priceRange, $gte: body.min_price };
    if (body.max_price) priceRange = { ...priceRange, $lte: body.max_price };
    if (Object.keys(priceRange).length > 0) filterConditions.price = priceRange;
    if (body.sort) sortConditions = { price: body.sort, block_height: -1 };
    const limit = body.limit ? body.limit : 10;
    const page = body.page ? body.page - 1 : 0;
    const offset = page * limit;
    const totalCount = await this.nftListModel.count(filterConditions).exec();
    const nftList = await this.nftListModel
      .find(filterConditions)
      .sort(sortConditions)
      .skip(offset)
      .limit(limit)
      .exec();

    return { total_count: totalCount, data: nftList };
  }

  async getListedNft(id: string, token: number): Promise<NftList | null> {
    return this.nftListModel.findOne({
      nft_contract: id,
      token_id: token,
    });
  }

  async getNftHistory(id: string, token: number): Promise<NftHistory[]> {
    return this.NftHistoryModel.find({
      nft_contract: id,
      token_id: token,
    });
  }

  async getCollectionHistory(id: string): Promise<NftHistory[]> {
    return this.NftHistoryModel.find({
      nft_contract: id,
      transaction_type: 'BUY',
    });
  }

  async getCollectionDetail(id: string): Promise<CollectionDetailsDto> {
    const total_listed = await this.nftListModel
      .count({ nft_contract: id, status: true })
      .exec();

    const available_attributes: CollectionDetailsDto['available_attributes'] =
      await this.nftListModel
        .aggregate()
        .match({ nft_contract: id, status: true })
        .unwind('nft_data.attributes')
        .group({
          _id: '$nft_data.attributes',
          count: { $sum: 1 },
          floor_price: { $min: '$price' },
        })
        .project({ attribute: '$_id', count: 1, floor_price: 1, _id: 0 })
        .exec();

    const details = await this.CollectionDetailModel.findOne({
      nft_contract: id,
    }).exec();

    return { total_listed, details, available_attributes };
  }
}
