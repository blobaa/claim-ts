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

