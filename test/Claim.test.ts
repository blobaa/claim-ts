
import { claim, PrepareUserDataParams, Claim, SetUserDataParams, UserData, CreateClaimParams, VerifyClaimParams } from '../src/index'
import config from './config';


describe('Claim module tests', () => {

    test('prepareUserData', () => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        const params: PrepareUserDataParams = { userData: config.userData.apuUnprepared };
        const preparedUserData = claim.prepareUserData(params);
        
        expect(preparedUserData[0].nonce.length).toBe(64);
        preparedUserData[0].nonce.split('').forEach(char => expect(charset.includes(char)).toBeTruthy());
        preparedUserData.forEach(preparedUserDataObject => expect(preparedUserDataObject.nonce).toBeDefined());
    });


    test('getHashes success', () => {
        const params: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params);
        const hashes = claim.createHashes();
        
        expect(hashes.rootHash).toBe(config.hashes.apu.rootHash);
        expect(JSON.stringify(hashes.leafHashes)).toBe(JSON.stringify(config.hashes.apu.leafHashes));
    });


    test('createClaim success', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'first-name',
                'birth-date',
                'country'
            ]
        };

        const claimObject = claim.createClaim(params2);


        expect(JSON.stringify(claimObject.userData[0])).toBe(JSON.stringify(config.userData.apu[0])); // first-name
        expect(JSON.stringify(claimObject.userData[1])).toBe(JSON.stringify(config.userData.apu[2])); // bith-date
        expect(JSON.stringify(claimObject.userData[2])).toBe(JSON.stringify(config.userData.apu[7])); // country
        
        expect(claimObject.hashes.rootHash).toBe(config.hashes.apu.rootHash);
        expect(claimObject.hashes.leafHashes.length).toBe(5);

        expect(claimObject.hashes.leafHashes[0]).toBe(config.hashes.apu.leafHashes[1]); // sur-name
        expect(claimObject.hashes.leafHashes[1]).toBe(config.hashes.apu.leafHashes[3]); // street
        expect(claimObject.hashes.leafHashes[2]).toBe(config.hashes.apu.leafHashes[4]); // street-number
        expect(claimObject.hashes.leafHashes[3]).toBe(config.hashes.apu.leafHashes[5]); // city
        expect(claimObject.hashes.leafHashes[4]).toBe(config.hashes.apu.leafHashes[6]); // zip
    });


    test('verifyClaim success', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'first-name',
                'birth-date',
                'country'
            ]
        };

        const claimObject = claim.createClaim(params2);


        const param3: VerifyClaimParams = { claimObject: claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeTruthy();
    });


    test('verifyClaim different user data error', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'first-name',
                'birth-date',
                'country'
            ]
        };

        const claimObject = claim.createClaim(params2);
        claimObject.userData[0].nonce = '42';
        

        const param3: VerifyClaimParams = { claimObject: claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeFalsy();
    });


    test('verifyClaim different leaf hash error', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'first-name',
                'birth-date',
                'country'
            ]
        };

        const claimObject = claim.createClaim(params2);
        claimObject.hashes.leafHashes[0] = '42';
        

        const param3: VerifyClaimParams = { claimObject: claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeFalsy();
    });


    test('verifyClaim different root hash error', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'first-name',
                'birth-date',
                'country'
            ]
        };

        const claimObject = claim.createClaim(params2);
        claimObject.hashes.rootHash = '42';
        

        const param3: VerifyClaimParams = { claimObject: claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeFalsy();
    });

});       