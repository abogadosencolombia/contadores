import { HyperledgerService } from './HyperledgerService';
import { ERC1400Service } from './ERC1400Service';
import { ITokenService } from './types';

export class TokenFactory {
  static getService(tipoRed: 'HYPERLEDGER' | 'ERC1400'): ITokenService {
    if (tipoRed === 'ERC1400') {
      return new ERC1400Service();
    }
    return new HyperledgerService();
  }
}