import Nonce from './lib/Nonce';
import Helpers from './lib/Helper';
import { sha256 } from 'js-sha256';
import utf8 from 'utf8';
import { IClaim, UserData, PrepareUserDataParams, Hashes, ClaimObject, SetUserDataParams, CreateClaimParams, VerifyClaimParams } from '../types';


export default class ClaimHandler implements IClaim {

    private userData: UserData[] = [];



    public prepareUserData = (params: PrepareUserDataParams): UserData[] => {
        const userDataWithNonce: UserData[] = [];
        
        params.unpreparedUserData.forEach(userDataObject => {
            userDataWithNonce.push({ name: userDataObject.name, value: userDataObject.value, nonce: Nonce.generate() });
        });

        return userDataWithNonce;
    }


    public setUserData = (params: SetUserDataParams): void => {
        this.userData = params.userData;
    }


    public createHashes = (): Hashes => {
        const leafHashes = this.createLeafHashes(this.userData);
        const rootHash = this.createRootHash(leafHashes);

        return { rootHash, leafHashes };
    }

    private createLeafHashes = (data: UserData[]): string[] => {
        const leafHashes: string[] = [];

        data.forEach(dataObject => {
            const concatData = Helpers.concatObjectValues({ name: dataObject.name, value: dataObject.value, nonce: dataObject.nonce });
            leafHashes.push(this.createHash(concatData));
        });

        return leafHashes;
    }

    private createHash = (data: string): string => {
        return sha256(utf8.encode(data));
    }

    private createRootHash = (leafHashes: string[]): string => {
        const concatLeafHashes = Helpers.concatArrayElements([ ...leafHashes ]);
        return this.createHash(concatLeafHashes);
    }


    public createClaim = (params: CreateClaimParams): ClaimObject => {
        const claimData = this.getClaimData(params.userDataNames);
        const claimDataLeafHashes = this.createLeafHashes(claimData);
        const userDataHashes = this.createHashes();
        const claimLeafHashes = this.getClaimLeafHashes(userDataHashes.leafHashes, claimDataLeafHashes);

        const claimObject: ClaimObject = {
            userData: claimData,
            hashes: {
                leafHashes: claimLeafHashes,
                rootHash: userDataHashes.rootHash
            }
        }
        return claimObject;
    }

    private getClaimData = (userDataNames: string[]): UserData[] => {
        const claimData: UserData[] = [];

        userDataNames.forEach(name => {
            this.userData.forEach(userDataObject => {
                if(name === userDataObject.name) claimData.push(userDataObject);
            });
        });

        return claimData;
    }

    private getClaimLeafHashes = (userDataLeafHashes: string[], claimDataLeafHashes: string[]): string[] => {
        return userDataLeafHashes.filter(userDataLeafHash => {
            let addToClaim = true;

            claimDataLeafHashes.forEach(claimDataLeafHash => {
                if(userDataLeafHash === claimDataLeafHash) addToClaim = false;
            });

            return addToClaim;
        });
    }

    
    public verifyClaim = (params: VerifyClaimParams): boolean => {
        const claimDataLeafHashes = this.createLeafHashes(params.claimObject.userData);
        const leafHashes = claimDataLeafHashes.concat(params.claimObject.hashes.leafHashes);
        const rootHash = this.createRootHash(leafHashes);

        return rootHash === params.claimObject.hashes.rootHash;
    }
}