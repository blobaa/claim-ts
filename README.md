# Claim TypeScript

An implementation of the [Claim](https://docu.blobaa.dev) module written in [TypeScript](https://www.typescriptlang.org).


<details><summary><i>Table of Contents</i></summary>
<p>

- [Claim TypeScript](#claim-typescript)
  - [Installation](#installation)
    - [Npmjs Registry](#npmjs-registry)
    - [Github Registry](#github-registry)
  - [Development](#development)
  - [General](#general)
  - [APIs](#apis)
    - [Claim](#claim)
  - [Example](#example)
    - [Claim Registration](#claim-registration)
    - [Verifiable Claim Creation](#verifiable-claim-creation)
    - [Claim Verification](#claim-verification)
  - [Module Instantiation](#module-instantiation)
  - [Licensing](#licensing)
    - [Dual-License](#dual-license)

</p>
</details>


## Installation

This library is published on GitHub's and npmjs's npm registry.


### Npmjs Registry

````
npm install @blobaa/claim-ts
````

See [npmjs package](https://www.npmjs.com/package/@blobaa/claim-ts).


### Github Registry

For using GitHub's registry, create a *.npmrc* file in the same directory as your *package.json* and add the following line 

````
@blobaa:registry=https://npm.pkg.github.com/blobaa
```` 

This tells npm to use the GitHub registry for @blobaa scoped packages. More information about multiple registry usage can be found in [this medium post](https://medium.com/@crysfel/using-different-registries-in-yarn-and-npm-766541d6f851).

You can now install the package via

````
npm install @blobaa/claim-ts
````

See [GitHub package](https://github.com/blobaa/claim-ts/packages/93052).

CAUTION: You need to [authenticate yourself](https://github.community/t5/GitHub-API-Development-and/Download-from-Github-Package-Registry-without-authentication/td-p/35255) to use the GitHub registry, even if it's a public available package.


## Development

You need to have [Node.js](https://nodejs.org/en/) installed.

To **initialize** the project just clone this repository and run
```
npm install
```

For **linting** run 
```
npm run lint
```

You can try to **autofix lint errors** with
```
npm run fix-lint
```

For **unit testing** run the following associated commands

browser:
```
npm run test-browser
```

node: 
```
npm run test-node
```

both: 
```
npm test
```


## General

This library implements the [Claim](https://docu.blobaa.dev/Claim.html) module and must therefore be used in conjunction with the [Attestation Protocol](https://docu.blobaa.dev/Attestation-Protocol.html) [implementation](https://github.com/blobaa/attestation-protocol-ts) to enable verifiable claim based authentication.


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

The **prepareUserData** function extends an unprepared user data object with a unique alphanumeric nonce.

The **setUserData** function consumes an array of prepared user data objects and stores it internally.

The **createHashes** function returns an object that contains the root hash and the leaf hashes of the user data object.

The **createClaim** function creates a claim object based on preselected user data.

The **verifyClaim** function verifies a claim object.


## Example

The following example shows sample code for the three Claim workflows (registering, creating, and verifying a verifiable claim). It uses, as described above, the Attestation Protocol implementation, additionally to this Claim library.

It shows a fictive scenario of a registration office where the user Oliver receives and uses the verifiable claim that represents a subset of his id card information.


### Claim Registration

````typescript
import { claim, SetUserDataParams, PrepareUserDataParams } from "@blobaa/claim-ts";
import { attestation, CreateLeafAttestationParams } from "@blobaa/attestation-protocol-ts";


/* unprepared claim user data */
const data = [
    { name: "address:city",     value: "Cologne" },
    { name: "address:country",  value: "Germany" },
    { name: "address:number",   value: "3" },
    { name: "address:street",   value: "Kölner Weg" },
    { name: "address:zip",      value: "11221" },
    { name: "person:firstName", value: "Oliver" },
    { name: "person:surName",   value: "Schmidt" },
    { name: "person:birthDay",  value: "11.11.2000" }
];


const claimRegistrationExample = async (): Promise<void> => {

    /*
     * Step 1: Add a nonce to each user data object
     * (optional. Can be omitted if the user data are already in prepared form)
     */

    const params1: PrepareUserDataParams = {
        unpreparedUserData: data
    };

    const userData = claim.prepareUserData(params1);

    /* the user data are now extended with unique 64 character long alphanumeric nonces */
    console.log("prepared user data:\n", userData, "\n");


    /*
     * Step 2: Get the root hash
     */

    const params2: SetUserDataParams = {
        userData
    };

    claim.setUserData(params2); // stores the user data array internally
    const claimHashes = claim.createHashes();

    /* the root hash is now accessible via the rootHash key */
    console.log("root hash:", claimHashes.rootHash, "\n");


    /*
     * Step 3: Attach the root hash as attestation payload
     */

    const rootHash = {
        rootHash: claimHashes.rootHash
    };

    const params3: CreateLeafAttestationParams = {
        leafAccount: "ARDOR-5HVX-MN8D-QNBH-4F6FE",      // account to be attested (Oliver`s account)
        attestationContext: "claimAuthentication",
        payload: JSON.stringify(rootHash),              // the root hash

        passphrase: "<some passphrase>",                // passphrase of attestor account
        myAttestorAccount: "ARDOR-47NS-P7AU-HZNN-84PW6" // [optional] account name of attestor accounts attestor.
                                                        // Required if attestor account is an intermediate entity
    };

    try {

        /* create and emit request */
        const response = await attestation.createLeafAttestation("https://testardor.jelurida.com", params3);

        /* the claim is now registered with the specified user data array to the attested account (Oliver`s account) */
        console.log("transaction id:", response.transactionId);


        /*
        * Step 4: Forward the prepared user data array to the attested account holder (to Oliver in this case)
        *
        * <your code>
        */

    } catch (e) { /* error handling (see attestation-protocol-ts readme) */ }

};

claimRegistrationExample();
````


### Verifiable Claim Creation

````typescript
import { claim, CreateClaimParams, SetUserDataParams } from "@blobaa/claim-ts";
import { data, SignDataParams } from "@blobaa/attestation-protocol-ts";


/* the prepared claim user data forwarded at the claim registration process (see Claim Registration) */
const userData = [
    { name: "address:city",     value: "Cologne",       nonce: "fNQKzWwac2OTPKLOsdF98bMq4xcLTozIZIOk9EF0vzL2xlIBB6EgUw7vztkB5oJ6" },
    { name: "address:country",  value: "Germany",       nonce: "IHCiJeCNitRqikxSxWUj3s0mOr8du3PCnkqaH7ooRkImZk7mKYKJc1xpzgx3Utc1" },
    { name: "address:number",   value: "3",             nonce: "dIMctTViKw4j1VjFnD9DYOky2CBxDlIcfOVpVqHxbthMXeyXyTnuJMO8J7rBQhir" },
    { name: "address:street",   value: "Kölner Weg",    nonce: "JlAIZKGGm9cBVd2ZZlO7eOnkVGROvV1B6gJCkEtjPGj2CLqcsfc9KJgbuobrCT0k" },
    { name: "address:zip",      value: "11221",         nonce: "Ztqy9Eep6sw6ZMWRU9AoucyFa3B46vJ0PswIOBStsAtaJEMeFbdGkPlqMXBgM09T" },
    { name: "person:firstName", value: "Oliver",        nonce: "Lz6yDcwEXgSWHsUt8YK1QCKBgb2eptTDif3xOks6KQx9BvKrZhXPqGqdrlIrZAGL" },
    { name: "person:surName",   value: "Schmidt",       nonce: "1lRu8pwklj33nTsFo0tRYLb3fQ732zR12eiZz2xFy4WiiavBzqrChRQIw1Mu2qbB" },
    { name: "person:birthDay",  value: "11.11.2000",    nonce: "1UB3TUC1yyeFnSkxJVhiqQBEzmeWt4lOQNUQ5kg0VIFbxYQPBgBgbE46ovvagtba" }
];


const verifiableClaimCreationExample = (): void => {

    /*
     * Step 1: Select the user data to claim
     */

    const params1: CreateClaimParams = {
        userDataNames: [
            "address:country",
            "person:birthDay"
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
    console.log("claim object:\n", claimObject, "\n\n");


    /*
     * Step 3: Sign the claim
     */

    const params3: SignDataParams = {
        attestationContext: "claimAuthentication",
        attestationPath: [                          // trust chain up to the root account
            "ARDOR-3ZKF-US3F-KGL7-GUEZE",
            "ARDOR-47NS-P7AU-HZNN-84PW6"
        ],
        payload: JSON.stringify(claimObject),       // stringified claim object
        passphrase: "chicken clerk liquid evil turtle duty like jeans beauty hundred swim sample"   // passphrase of claim creator account (Oliver`s account)
    };

    const signedClaim = data.signData(params3, true);

    /* the signed claim object is now ready to be shared and verified */
    console.log("signed claim object:\n", signedClaim);
};

verifiableClaimCreationExample();
````


### Claim Verification

````typescript
import { claim, VerifyClaimParams, ClaimObject } from "@blobaa/claim-ts";
import { data, VerifySignedDataParams, SignedDataCheckParams, EntityCheckParams, Error, ErrorCode, SignedData } from "@blobaa/attestation-protocol-ts";


/* the signed claim created at the claim creation process (see Verifiable Claim Creation) */
const signedClaim: SignedData = {
  attestationContext: "claimAuthentication",
  attestationPath: [ "ARDOR-3ZKF-US3F-KGL7-GUEZE", "ARDOR-47NS-P7AU-HZNN-84PW6" ],
  creatorAccount: "ARDOR-5HVX-MN8D-QNBH-4F6FE",
  payload: "{\"userData\":[{\"name\":\"address:country\",\"value\":\"Germany\",\"nonce\":\"IHCiJeCNitRqikxSxWUj3s0mOr8du3PCnkqaH7ooRkImZk7mKYKJc1xpzgx3Utc1\"},{\"name\":\"person:birthDay\",\"value\":\"11.11.2000\",\"nonce\":\"1UB3TUC1yyeFnSkxJVhiqQBEzmeWt4lOQNUQ5kg0VIFbxYQPBgBgbE46ovvagtba\"}],\"hashes\":{\"leafHashes\":[\"739e1eec28e2c8c551e730a9480f63a7b93bb9aa48bd54463fbf44aa2e54ce8d\",\"5837ac6ce233f9a3d75bd8e41d3febe5ec59f9590f665b625c9cc0a408711361\",\"1be4b90fa974e78300d0c6d36eb3cfb7ceadcd38790fd60938ef210deb732dd6\",\"33a0ad65e9d7183128aa1b24be9d7fc5f774fa940345844d5f6f3a3d54214b7e\",\"3e4b13d21def5c17f8896ae2903b90c9e3df0c33e784629d889da0e276488c78\",\"e9be2351d0969531cae85b6d697fc561fc3701014543b4e0412c75976aaba857\"],\"rootHash\":\"077e142468b011a454b62991a54e17b4b2408bcc5a73f7de87f188335280b17b\"}}",
  signature: "4f31stdpt2hm70iu8oer1tsq4lekck2rmt565f3eult4ocob3a2juomqs5s2ah0439t762igiof08rcr84rumr6lkf8vt9cfhuqutimf840gl1memb6mndh70i3gg4eacqcl13nvcb8206urs8evh03cm6nj02m2"
};


const claimVerificationExample = async (): Promise<void> => {

    /*
     * Step 1: Create a claim check callback
     */

    let rootHash = "";
    let claimCreator = "";

    const claimCheckCallback = (params1: SignedDataCheckParams): boolean => {
        let claimObject: ClaimObject
       
        /* parse the claim object */
        try {
            claimObject = JSON.parse(params1.signedData.payload);
        } catch (e) {
            return false;
        } 

        /* get user data */
        console.log("claim user data:\n", claimObject.userData, "\n");

        /* get the claim signature time */
        console.log("claim signature time:", new Date(params1.signatureTime), "\n\n");


        /* verify the claim */
        const params2: VerifyClaimParams = {
            claimObject
        };

        const isClaimValid = claim.verifyClaim(params2);


        /* store information for claim entity checks */
        claimCreator = params1.signedData.creatorAccount;
        rootHash = claimObject.hashes.rootHash;


        return isClaimValid; // verification process stops in case of an invalid claim
    };


    /*
     * Step 2: Create a claim entity check callback
     */

    let isRootHashAttested = false;

    const claimEntityCheckCallback = (entity: EntityCheckParams): boolean => {

        /* show trust chain entities */
        console.log("account: ", entity.account);
        console.log("payload: ", entity.payload);
        console.log("entity : ", entity.entityType, "\n");


        /* check if the root hash is attached to the claim creator account */
        if (!isRootHashAttested) {
            let parsedRootHash: string;

            try {
                parsedRootHash = JSON.parse(entity.payload).rootHash;
            } catch (e) {
                return false;
            }

            if (claimCreator === entity.account && rootHash === parsedRootHash) {
                isRootHashAttested = true;
            }
        }

        return isRootHashAttested; // verification process stops in case of an unattested root hash
    };


    /*
     * Step 3: Request claim verification
     */

    const params: VerifySignedDataParams = {
        trustedRootAccount: "ARDOR-47NS-P7AU-HZNN-84PW6", // the trust chain`s root account
        signedData: signedClaim,
        signedDataCheckCallback: claimCheckCallback,
        entityCheckCallback: claimEntityCheckCallback
    };

    try {

        /* create and emit request */
        const response = await data.verifySignedData("https://testardor.jelurida.com", params, true);

        /* Congratulation!!!, you have successfully finished the verification process. The claim is valid and attested */
        console.log("\n", "claim is ok :)");
        console.log("verification information:\n", response);

    } catch (e) {

        /* if your program reaches these lines, an error occurred and the verification finished without success. */
        const error = e as Error;

        switch (error.code) {
            case ErrorCode.SIGNED_DATA_CALLBACK_ERROR:
                console.log("\n", "claim is invalid :(");
                break;
            case ErrorCode.ENTITY_CALLBACK_ERROR:
                console.log("\n", "claim creator account is not attested or root hashes mismatch :(");
                break;
            default:
                console.log(error);
        }
    }
};

claimVerificationExample();
````


## Module Instantiation

The claim module is pre instantiated and importable via the lower case module name. If you need the class definition, import it via the upper case name. For example:

````typescript
import { claim, Claim, PrepareUserDataParams} from '@blobaa/claim-ts'


const params: PrepareUserDataParams = {
    userData: [
        { name: 'data1', value: '42'},
        { name: 'data2', value: '42'}
    ]
};


/* use the default instance */
const userData = claim.prepareUserData(params);
console.log(userData);

/* use your own instance */
const myClaim = new Claim();
const userData2 = myClaim.prepareUserData(params);
console.log(userData2);
````


## Licensing

### Dual-License
claim-ts source code ("The Software") is licensed under **both** GNU Affero General Public License v3.0 or later **and** a proprietary license that can be arranged with me. In practical sense, this means:

- If you are developing Open Source Software (OSS) based on claim-ts, chances are you will be able to use claim-ts freely under AGPL. Please double check [here](https://www.gnu.org/licenses/agpl-3.0.en.html) for OSS license compatibility with AGPL.
- Alternatively, if you are unable to release your application as Open Source Software, you may arrange alternative licensing with me. Just send your inquiry to hi.blobaa@gmail.com to discuss this option.

____
Enjoy :)
