import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { lodashModule } from '../lodash/lodash.module';
import { RpnService } from './rpn.service';

describe('TweetsService', () => {
  let service: RpnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpnService],
      imports: [HttpModule, lodashModule],
    }).compile();

    service = module.get<RpnService>(RpnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
