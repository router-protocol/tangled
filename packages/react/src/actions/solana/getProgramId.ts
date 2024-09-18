import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const getProgramId = (tokenAddress: string) => {
  return tokenAddress === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID;
};
