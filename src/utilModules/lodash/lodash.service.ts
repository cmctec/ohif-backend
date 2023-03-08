import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

@Injectable()
export class LodashService {
  pickBy(data: Record<string, any>) {
    // убираю undefined
    return _.pickBy(
      data,
      (v) =>
        !(
          v === undefined ||
          v === null ||
          v === '' ||
          v.toString() === 'Invalid Date'
        ),
    );
  }
  pickByUndefinedOrNull(data: Record<string, any>) {
    // убираю undefined
    return _.pickBy(data, (v) => !(v === undefined || v === null));
  }
}
