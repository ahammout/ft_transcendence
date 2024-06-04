import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getMatchHistory(@Req() req: Request) {
    try {
      const jwtUser = req.user as any;
      const ret = await this.matchHistoryService.getMatchHistory(jwtUser.sub);
      // res.json(ret);
      return ret;
    } catch (error) {
      console.error(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getMatchHistoryById(@Param('id', ParseIntPipe) id: number) {
    try {
      const ret = await this.matchHistoryService.getMatchHistory(id);
      // res.json(ret);
      return ret;
    } catch (error) {
      console.error(error);
    }
  }
}
