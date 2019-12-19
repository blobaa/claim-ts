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


export interface IClaim {
    // new (property: string): IClaim;
    // static prepareUserData: (params: PrepareUserDataParams) => UserData[];  (Unfortunately TypeScript doesn't allow static method declaration in interfaces)
    getHashes: () => Hashes;
}

