/*
 *  Copyright (C) 2020  Attila Aldemir <a_aldemir@hotmail.de>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { sha256 } from "js-sha256";
import utf8 from "utf8";
import { ClaimObject, CreateClaimParams, Hashes, IClaimService, PrepareUserDataParams, SetUserDataParams, UserData, VerifyClaimParams } from "../../../types";
import Helper from "./utils/Helper";
import Nonce from "./utils/Nonce";


export default class ClaimService implements IClaimService {

    private userData: UserData[] = [];


    public prepareUserData(params: PrepareUserDataParams): UserData[] {
        const userDataWithNonce: UserData[] = [];

        params.unpreparedUserData.forEach((userDataObject) => {
            userDataWithNonce.push({
                name: userDataObject.name,
                value: userDataObject.value, nonce: Nonce.generate()
            });
        });

        return userDataWithNonce;
    }


    public setUserData(params: SetUserDataParams): void {
        this.userData = params.userData;
    }


    public createHashes(): Hashes {
        const leafHashes = this.createLeafHashes(this.userData);
        const rootHash = this.createRootHash(leafHashes);

        return { rootHash, leafHashes };
    }

    private createLeafHashes(data: UserData[]): string[] {
        const leafHashes: string[] = [];

        data.forEach((dataObject) => {
            const concatData = Helper.concatObjectValues({
                name: dataObject.name,
                value: dataObject.value,
                nonce: dataObject.nonce
            });
            leafHashes.push(this.createHash(concatData));
        });

        return leafHashes;
    }

    private createHash(data: string): string {
        return sha256(utf8.encode(data));
    }

    private createRootHash(leafHashes: string[]): string {
        const concatLeafHashes = Helper.concatArrayElements([ ...leafHashes ]);
        return this.createHash(concatLeafHashes);
    }


    public createClaim(params: CreateClaimParams): ClaimObject {
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
        };
        return claimObject;
    }

    private getClaimData(userDataNames: string[]): UserData[] {
        const claimData: UserData[] = [];

        userDataNames.forEach((name) => {
            this.userData.forEach((userDataObject) => {
                if (name === userDataObject.name) {
                    claimData.push(userDataObject);
                }
            });
        });

        return claimData;
    }

    private getClaimLeafHashes(userDataLeafHashes: string[], claimDataLeafHashes: string[]): string[] {
        return userDataLeafHashes.filter((userDataLeafHash) => {
            let addToClaim = true;

            claimDataLeafHashes.forEach((claimDataLeafHash) => {
                if (userDataLeafHash === claimDataLeafHash) {
                    addToClaim = false;
                }
            });

            return addToClaim;
        });
    }


    public verifyClaim(params: VerifyClaimParams): boolean {
        const claimDataLeafHashes = this.createLeafHashes(params.claimObject.userData);
        const leafHashes = claimDataLeafHashes.concat(params.claimObject.hashes.leafHashes);
        const rootHash = this.createRootHash(leafHashes);

        return rootHash === params.claimObject.hashes.rootHash;
    }
}