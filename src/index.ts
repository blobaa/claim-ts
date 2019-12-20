import ClaimHandler from './modules/ClaimHandler'
import { IClaim } from './types';

export * from './types'


export const claim: IClaim = new ClaimHandler();
export class Claim extends ClaimHandler {};