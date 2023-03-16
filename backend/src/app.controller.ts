import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NftListDto } from './dtos/nftList.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('collection-nfts')
  getallNft(@Body() body: NftListDto) {
    return this.appService.getAllNft(body);
  }

  @Get('listed-nft/:id/:token')
  getListedNft(@Param('id') id: string, @Param('token') token: number) {
    return this.appService.getListedNft(id, token);
  }

  @Get('nft-history/:id/:token')
  getNftHistory(@Param('id') id: string, @Param('token') token: number) {
    return this.appService.getNftHistory(id, token);
  }

  @Get('collection-history/:id')
  getCollectionHistory(@Param('id') id: string) {
    return this.appService.getCollectionHistory(id);
  }

  @Get('collection-details/:id')
  getCollectionDetail(@Param('id') id: string) {
    return this.appService.getCollectionDetail(id);
  }
}
