# claim-ts

An implementation of the Attestation Protocol [Claim Extension](https://github.com/project-ap/documentation/wiki/Attestation-Protocol) written in [TypeScript](https://www.typescriptlang.org).


- [claim-ts](#claim-ts)
  - [Install](#install)
  - [Test](#test)
  - [General](#general)
  - [APIs](#apis)
    - [Claim](#claim)
      - [Claim Registration](#claim-registration)
      - [Verifiable Claim Creation](#verifiable-claim-creation)
      - [Claim Verification](#claim-verification)


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


/* unprepared claim user data */
const data = [
    { name: 'general:givenName',    value: 'apu' },
    { name: 'general:surName',      value: 'nahasapeemapetilon' },
    { name: 'general:nationality',  value: 'american' },
    { name: 'birth:date',           value: '04.02.1942' },
    { name: 'birth:place',          value: 'rahmatpur' },
    { name: 'address:city',         value: 'springfield' },
    { name: 'address:zip',          value: '422442' },
    { name: 'address:state',        value: 'illinois' },
    { name: 'address:countryCode',  value: 'us' }
];


const claimRegistrationExample = async () => {

    /*
     * Step 1: Add a nonce to each user data object
     * (optional. Can be omitted if the user data are already in prepared form)
     */

    const params1: PrepareUserDataParams = {
        unpreparedUserData: data
    };
    
    const userData = claim.prepareUserData(params1);

    /* the user data are now extended with unique 64 character long alphanumeric nonces */
    console.log('prepared user data:\n', userData, '\n');


    /*
     * Step 2: Get the root hash
     */

    const params2: SetUserDataParams = {
        userData: userData
    };

    claim.setUserData(params2); // stores the user data array internally
    const claimHashes = claim.createHashes();

    /* the root hash is now accessible via the rootHash key */
    console.log('root hash:', claimHashes.rootHash, '\n');


    /*
     * Step 3: Attach the root hash as attestation payload
     */

    const params3: CreateLeafAttestationParams = {
        leafAccount: 'ARDOR-5HVX-MN8D-QNBH-4F6FE',      // account to be attested (Apu`s account)
        attestationContext: 'claimExample',
        payload: claimHashes.rootHash,                  // the root hash
        
        passphrase: '<some passphrase>',                // passphrase of attestor account
        myAttestorAccount: 'ARDOR-ZXVB-LCDL-DE2U-22LK6' // [optional] account name of attestor accounts attestor.
                                                        // Required if attestor account is an intermediate entity
    };

    try {

        /* create and emit request */
        const response =await attestation.createLeafAttestation('https://testardor.jelurida.com', params3);

        /* the claim is now registered with the specified user data array to the attested account (Apu`s account) */
        console.log('transaction id:', response.transactionId);


        /* 
        * Step 4: Forward the prepared user data array to the attested account holder (to Apu in this case)
        * 
        * <your code>
        */

    } catch (e) { /* error handling (see attestation-protocol-ts readme) */ }
    
}

claimRegistrationExample();
````


#### Verifiable Claim Creation

````typescript
import { claim, CreateClaimParams, SetUserDataParams } from '@project-ap/claim-ts';
import { data, SignDataParams } from '@project-ap/attestation-protocol-ts';


/* the prepared claim user data forwarded at the claim registration process (see Claim Registration) */
const userData = [
    { name: 'general:givenName',    value: 'apu',                   nonce: '2LqyL4UHmjNFd2UfykUud7niemEEyUBSfAYvTKMKX6ipM37G6Fk94AtCqlFHJOHr' },
    { name: 'general:surName',      value: 'nahasapeemapetilon',    nonce: 'WNTZLpacUsMYYhfZdmsn2UwvAMay6zcDEgWwSdUYYzNNssvCkmyQVm6jd6ATfmTj' },
    { name: 'general:nationality',  value: 'american',              nonce: 'ODUVizex9PEkFG63ZVI7h4Ae6qyj5tYK5iZ9bpOjpHXx1dJhkoLELNHvOOtHIQmq' },
    { name: 'birth:date',           value: '04.02.1942',            nonce: '7LqA72Nqw1ONeQNCKUoub6GnnjrjqeX8wCS5UdjyfERMBIpvMbHOhY6FbNUvK3Hr' },
    { name: 'birth:place',          value: 'rahmatpur',             nonce: '0rc71Das18a7blLvL2warMpiaw5Q7PsXq8EgEmFBqcDbsZFxmNshRHfbbxuEtEi1' },
    { name: 'address:city',         value: 'springfield',           nonce: 'eBaiWBcw4AHaeI5pWcRasvaXJFaP0ApL1vOktdj30wH1fTSBvyHuEmGavtgfDwra' },
    { name: 'address:zip',          value: '422442',                nonce: '9WMkXLFFo2xdjkZDJYyMtVUm0YwUtnkireFRBdvHjeldUpue8nYFf6lBojHzrlYB' },
    { name: 'address:state',        value: 'illinois',              nonce: 'gI9dDBoOqT2Vt04Hmbi59tsZuvyCSLNfPRmlJxeU4IiZN4FdsIZJEvU9RNyNJa9i' },
    { name: 'address:countryCode',  value: 'us',                    nonce: 'EnYg7EpDzOSPJM3QVfi0DtKmgwiYX4slAv5zNPmenSXiM5PSPAz03PfNI5C1XEDV' }
];


const verifiableClaimCreationExample = () => {
    
    /*
     * Step 1: Select the user data to claim
     */

    const params1: CreateClaimParams = {
        userDataNames: [
            'general:nationality',
            'birth:date'
        ]
    };


    /*
     * Step 2: Create the claim
     */
    
    const params2: SetUserDataParams = {
        userData: userData
    };

    claim.setUserData(params2);
    const claimObject = claim.createClaim(params1);

    /* the claim object bundles the selected user data along with claim verification information */
    console.log('claim object:\n', claimObject, '\n\n');
    

    /*
     * Step 3: Sign the claim
     */

    const params3: SignDataParams = {
        attestationContext: 'claimExample',
        attestationPath: [                      // trust chain up to the root account
            'ARDOR-WL4V-48P3-8RYH-6KFJ5',
            'ARDOR-ZXVB-LCDL-DE2U-22LK6' 
        ],
        payload: JSON.stringify(claimObject),   // stringified claim object
        passphrase: 'chicken clerk liquid evil turtle duty like jeans beauty hundred swim sample'   // passphrase of claim creator account (Apu`s account)
    };

    const signedClaim = data.signData(params3, true);

    /* the signed claim object is now ready to be shared and verified */
    console.log('signed claim object:\n', signedClaim);
}

verifiableClaimCreationExample();
````


#### Claim Verification

````typescript
import { claim, VerifyClaimParams, ClaimObject } from '@project-ap/claim-ts'
import { data, VerifySignedDataParams, SignedDataCheckParams, EntityCheckParams, Error, ErrorCode, SignedData } from '@project-ap/attestation-protocol-ts'


/* the signed claim created at the claim creation process (see Verifiable Claim Creation) */
const signedClaim: SignedData = { 
    payload: '{"userData":[{"name":"general:nationality","value":"american","nonce":"ODUVizex9PEkFG63ZVI7h4Ae6qyj5tYK5iZ9bpOjpHXx1dJhkoLELNHvOOtHIQmq"},{"name":"birth:date","value":"04.02.1942","nonce":"7LqA72Nqw1ONeQNCKUoub6GnnjrjqeX8wCS5UdjyfERMBIpvMbHOhY6FbNUvK3Hr"}],"hashes":{"leafHashes":["2062f74d687e4d8498116de9ea9a63f89b2b98b5442989c474088d27da618300","783fd6868618d40f86aec0d3468fb15a1aa6464d0bd34eea9478b8d3637becd8","b873d6e588d7642693b49cb55d93a53fd83afed045452b41c189876cae8c3e02","41c09ec51d6f373edf20559e929029a44e68fa80d3bafdb44e41d6551562c27f","c408700b01a0f7129ef44b2257dac882721cdb2795ed7a74698f5e2b12b13139","e68fcaaa6f8e5801bc1870ddd5c8e1f585cbf91ca481c2afd96404a4d6a11993","ae8934aca3733e086240141dee61233bdb8b06b7836f01c78e37ac089b3be7ab"],"rootHash":"9eb00fd0e01dbb903ce6512fe0c8612692b60724e0b2d7a41891f5666912153e"}}',
    attestationContext: 'claimExample',
    attestationPath: [ 'ARDOR-WL4V-48P3-8RYH-6KFJ5', 'ARDOR-ZXVB-LCDL-DE2U-22LK6' ],
    creatorAccount: 'ARDOR-5HVX-MN8D-QNBH-4F6FE',
    signature: '4f31stdpt2hm70iu8oer1tsq4lekck2rmt565f3eult4ocobp038komqp5m4ia83brd9ms9ntk3nfmm3bfsm988dtdncsel25qp0qsm7im5gddph5keiv7pqbimf6m8r3corvj3lgdonb998mj5tijomg81cdnmd'
};


const claimVerificationExample = async () => {

    /*
     * Step 1: Create a claim check callback
     */

    let rootHash = "";
    let claimCreator = "";

    const claimCheckCallback = (params: SignedDataCheckParams): boolean => {
        
        /* parse the claim object */
        const claimObject: ClaimObject = JSON.parse(params.signedData.payload);
        
        
        /* get user data */
        console.log('claim user data:\n', claimObject.userData, '\n');

        /* get the claim signature time */
        console.log('claim signature time:', new Date(params.signatureTime), '\n\n');


        /* verify the claim */
        const params1: VerifyClaimParams = {
            claimObject: claimObject
        };

        const isClaimValid = claim.verifyClaim(params1);


        /* store information for claim entity checks */
        claimCreator = params.signedData.creatorAccount;
        rootHash = claimObject.hashes.rootHash;


        return isClaimValid; // verification process stops in case of an invalid claim
    };


    /*
     * Step 2: Create a claim entity check callback
     */
    
    let isRootHashAttested = false;
    
    const claimEntityCheckCallback = (entity: EntityCheckParams): boolean => {

        console.log('account: ', entity.account);
        console.log('payload: ', entity.payload);
        console.log('entity : ', entity.entityType, '\n');

        /* check if the root hash is attached to the claim creator account */
        if(claimCreator === entity.account && rootHash === entity.payload) {
            isRootHashAttested = true;
        }


        return isRootHashAttested; // verification process stops in case of an unattested root hash
    };


    /*
     * Step 3: Request claim verification
     */

    const params: VerifySignedDataParams = {
        trustedRootAccount: "ARDOR-ZXVB-LCDL-DE2U-22LK6", // the trust chain`s root account
        signedData: signedClaim,
        signedDataCheckCallback: claimCheckCallback,
        entityCheckCallback: claimEntityCheckCallback
    };

    try {

        /* create and emit request */
        const response = await data.verifySignedData("https://testardor.jelurida.com", params, true);
        
        /* Congratulation!!!, you have successfully finished the verification process. The claim is valid and attested */
        console.log('\n', 'claim is ok :)');
        console.log('verification information:\n', response);

    } catch (e) { 

        /* if your program reaches these lines, an error occurred and the verification finished without success. */
        const error = e as Error

        switch(error.code) {
            case ErrorCode.SIGNED_DATA_CALLBACK_ERROR: 
                console.log('\n', 'claim is invalid :('); 
                break;
            case ErrorCode.ENTITY_CALLBACK_ERROR: 
                console.log('\n', 'claim creator account is not attested or root hashes mismatch :('); 
                break;
            default:
                console.log(error);
        }
    }
}

claimVerificationExample();
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