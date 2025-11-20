export interface ITokenService {
  mintToken(
    inversionistaAddress: string,
    monto: number,
    documentoHash: string,
    metadata: Record<string, unknown>
  ): Promise<string>; // Retorna el Transaction Hash
}
