import { ethers } from 'ethers';
import ERC1400_ABI from './abis/ERC1400.json';
import { ITokenService } from './types';

export class ERC1400Service implements ITokenService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY_ISSUER;
    const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing blockchain configuration environment variables');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, ERC1400_ABI, this.wallet);
  }

  async mintToken(inversionistaAddress: string, monto: number, documentoHash: string, _metadata: Record<string, unknown>): Promise<string> {
    // Ensure the hash is 0x-prefixed for bytes32
    const docHashBytes = documentoHash.startsWith('0x') ? documentoHash : `0x${documentoHash}`;
    
    // Log metadata to avoid unused variable error and for debugging
    console.log('Minting token with metadata:', _metadata);

    // ERC-1400 issueByPartition (partition, tokenHolder, value, data)
    const partition = ethers.encodeBytes32String('ORDINARIAS');

    const tx = await this.contract.issueByPartition(
      partition,
      inversionistaAddress,
      ethers.parseUnits(monto.toString(), 18), // Asumiendo 18 decimales
      docHashBytes // Data extra: El hash del PDF legal
    );

    await tx.wait();
    return tx.hash;
  }
}