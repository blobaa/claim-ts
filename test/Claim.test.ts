
import { claim, PrepareUserDataParams, Claim } from '../src/index'
import config from './config';


describe('Claim module tests', () => {

    test('prepareUserData', () => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        

        const params: PrepareUserDataParams = {
            userData: config.userData.apuUnprepared
        }
        
        const preparedUserData = claim.prepareUserData(params);
        
        
        expect(preparedUserData[0].nonce.length).toBe(64);
        preparedUserData[0].nonce.split('').forEach(char => expect(charset.includes(char)).toBeTruthy());
        preparedUserData.forEach(preparedUserDataObject => expect(preparedUserDataObject.nonce).toBeDefined());
    });


    test('getHashes success', () => {

        claim.setUserData(config.userData.apu);
        const hashes = claim.createHashes();
        
        expect(hashes.rootHash).toBe(config.hashes.apu.rootHash);
        expect(JSON.stringify(hashes.leafHashes)).toBe(JSON.stringify(config.hashes.apu.leafHashes));
    });


    test('createClaim success', () => {

        claim.setUserData(config.userData.apu);
        const claimObject = claim.createClaim([ 'first-name', 'birth-date', 'country' ]);

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

});       