export type objectAny = {[name: string]: any};
export type atomicObject = {[name: string]: string};


export interface PrepareUserDataParams {
    userData: { name: string, value: string}[];
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

export interface ClaimObject {
    userData: UserData[];
    hashes: Hashes;
}


export interface IClaim {
    prepareUserData: (params: PrepareUserDataParams) => UserData[];
    createHashes: () => Hashes;
    setUserData: (userData: UserData[]) => void;
    createClaim: (userDataNames: string[]) => ClaimObject;
}

