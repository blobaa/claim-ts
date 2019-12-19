
import { Claim, PrepareUserDataParams } from '../src/index'
import config from './config';


describe('Claim module tests', () => {

    test('prepareUserData', () => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        

        const params: PrepareUserDataParams = {
            userData: config.userData.apuUnprepared
        }
        
        const preparedUserData = Claim.prepareUserData(params);
        
        
        expect(preparedUserData[0].nonce.length).toBe(64);
        preparedUserData[0].nonce.split('').forEach(char => expect(charset.includes(char)).toBeTruthy());
        preparedUserData.forEach(preparedUserDataObject => expect(preparedUserDataObject.nonce).toBeDefined());
    });


    test('getHashes success', () => {

        const claim = new Claim(config.userData.apu);
        const hashes = claim.getHashes();

        expect(hashes.rootHash).toBe(config.hashes.apu.rootHash);
        expect(JSON.stringify(hashes.leafHashes)).toBe(JSON.stringify(config.hashes.apu.leafHashes));
    });

});       