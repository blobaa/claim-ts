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

export type objectAny = {[name: string]: any};
export type atomicObject = {[name: string]: string};


export interface PrepareUserDataParams {
    unpreparedUserData: { name: string, value: string}[];
}

export interface UserData { 
    name: string;
    value: string;
    nonce: string;
}

export interface Hashes {
    leafHashes: string[];
    rootHash: string;
}

export interface SetUserDataParams {
    userData: UserData[];
}

export interface CreateClaimParams {
    userDataNames: string[];
}

export interface ClaimObject {
    userData: UserData[];
    hashes: Hashes;
}

export interface VerifyClaimParams {
    claimObject: ClaimObject;
}


export interface IClaim {
    prepareUserData: (params: PrepareUserDataParams) => UserData[];
    createHashes: () => Hashes;
    setUserData: (params: SetUserDataParams) => void;
    createClaim: (params: CreateClaimParams) => ClaimObject;
    verifyClaim: (params: VerifyClaimParams) => boolean;
}

