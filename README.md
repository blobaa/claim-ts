# claim-ts

An implementation of the Attestation Protocol [Claim Extension](https://github.com/project-ap/documentation/wiki/Attestation-Protocol) written in [TypeScript](https://www.typescriptlang.org).


- [claim-ts](#claim-ts)
  - [Install](#install)
  - [Test](#test)
  - [General](#general)
  - [APIs](#apis)
    - [Claim](#claim)
      - [Claim Registration](#claim-registration)


## Install

At the current state this library is published to the GitHub npm registry only.
To use it as a dependency, create an *.npmrc* file in the same directory as your *package.json* and add the following line 

````
@project-ap:registry=https://npm.pkg.github.com/project-ap
@somedotone:registry=https://npm.pkg.github.com/somedotone
```` 

This tells npm to use the GitHub registry for scoped packages.
You can now install the npm package via

````
npm install @project-ap/claim-ts@<release version>
````

More information can be found at the [npm package](https://github.com/project-ap/claim-ts/packages/93052) description and [this medium post](https://medium.com/@crysfel/using-different-registries-in-yarn-and-npm-766541d6f851) about multiple registry usage.



## Test

browser:
````
npm run test-browser
````

node:
````
npm run test-node
````

`npm test` runs both tests.


## General

<!-- This library uses the [ardor-ts](https://github.com/somedotone/ardor-ts) package to interact with the [Ardor](ardorplatform.org/) Blockchain. At the current state there is no child chain and fee configuration possible. It uses the default ardor-ts configuration and therefore the IGNIS child chain and automatic fee calculation.

There are lots of tests in the test folder. Have a look if you need some additional examples of how to use the APIs.

This version implements the Attestation Protocol version 1.0.0 -->


## APIs

The library contains the following module:

### Claim

The Claim module provides APIs for claim data preparation, claim creation and claim verification:

````typescript
- prepareUserData: (params: PrepareUserDataParams) => UserData[]
- setUserData: (params: SetUserDataParams) => void
- createHashes: () => Hashes
- createClaim: (params: CreateClaimParams) => ClaimObject
- verifyClaim: (params: VerifyClaimParams) => boolean
````




#### Claim Registration

````typescript
import { claim, SetUserDataParams, PrepareUserDataParams } from '@project-ap/claim-ts'
import { attestation, CreateLeafAttestationParams } from '@project-ap/attestation-protocol-ts'


const ClaimRegistration = async () => {

    /* example unprepared claim user data */
    const data = [{
            name: 'general:givenName',
            value: 'apu'
        },{
            name: 'general:surName',
            value: 'nahasapeemapetilon'
        },{
            name: 'general:nationality',
            value: 'american'
        },{
            name: 'birth:date',
            value: '04.02.1942'
        },{
            name: 'birth:place',
            value: 'rahmatpur'
        },{
            name: 'address:city',
            value: 'springfield'
        },{
            name: 'address:zip',
            value: '422442'
        },{
            name: 'address:state',
            value: 'illinois'
        },{
            name: 'address:countryCode',
            value: 'us'
        }
    ];


    /*
     * 1. Step: Add a nonce to each user data object
     */

    const params1: PrepareUserDataParams = {
        unpreparedUserData: data
    };
    
    const userData = claim.prepareUserData(params1);

    /* the user data are now extended with unique nonces */
    userData.forEach(userDatum => {
        console.log(userDatum.name);
        console.log(userDatum.value);
        console.log(userDatum.nonce); // <random 64 character long alphanumeric string>
    });


    /* forward the prepared user data array to the attested account holder (to Apu in this case) */


    /*
     * 2. Step: Get the root hash
     */

    const params2: SetUserDataParams = {
        userData: userData
    };

    claim.setUserData(params2); // stores the user data array internally
    const claimHashes = claim.createHashes();

    /* the root hash is now accessible via the rootHash key */
    console.log(claimHashes.rootHash);


    /*
     * 3. Step: Attach the root hash as attestation payload
     */

    const params3: CreateLeafAttestationParams = {
        leafAccount: "ARDOR-ACCO-UNTT-OBEA-TTEST",      // account to be attested (Apu`s account)
        attestationContext: "exampleClaimContext",
        payload: claimHashes.rootHash,                  // the root hash
        
        passphrase: "<some passphrase>",                // passphrase of attestor account
        myAttestorAccount: "ARDOR-MYAT-TEST-ORAC-COUNT" // [optional] account name of attestor accounts attestor.
                                                        // Required if attestor account is an intermediate entity
    };

    try {

        /* create and emit request */
        const response =await attestation.createLeafAttestation("https://testardor.jelurida.com", params3);

        /* the claim is now registered with the specified user data array to the attested account (Apu`s account) */
        console.log(response.transactionId);

    } catch (e) { /* error handling (see attestation-protocol-ts readme) */ }
    
}

ClaimRegistration();
````


<!-- ## Module Instantiation

Each module is pre instantiated and importable via the lower case module name. If you need the class definition of a module, import it via the upper case name. For example:

````typescript
import { SignDataParams, data, Data } from '@project-ap/attestation-protocol-ts'


const params: SignDataParams = {
    attestationContext: "exampleContext",
    payload: "exampleDataPayload",
    passphrase: "<some passphrase>"
};


/* use the default instance */
const signedData = data.signData(params);
console.log(signedData);

/* use your own instance */
const myData = new Data();
const signedData2 = myData.signData(params);
console.log(signedData2);
```` -->