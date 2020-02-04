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

/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export type objectAny = {[name: string]: any};
export type atomicObject = {[name: string]: string};

export type PrepareUserDataParams = {
    unpreparedUserData: { name: string; value: string}[];
}

export type UserData = {
    name: string;
    value: string;
    nonce: string;
}

export type Hashes = {
    leafHashes: string[];
    rootHash: string;
}

export type SetUserDataParams = {
    userData: UserData[];
}

export type CreateClaimParams = {
    userDataNames: string[];
}

export type ClaimObject = {
    userData: UserData[];
    hashes: Hashes;
}

export type VerifyClaimParams = {
    claimObject: ClaimObject;
}


export interface IClaim {
    prepareUserData(params: PrepareUserDataParams): UserData[];
    createHashes(): Hashes;
    setUserData(params: SetUserDataParams): void;
    createClaim(params: CreateClaimParams): ClaimObject;
    verifyClaim(params: VerifyClaimParams): boolean;
}


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IClaimService extends IClaim {}