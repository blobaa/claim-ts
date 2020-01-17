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

import { claim, CreateClaimParams, PrepareUserDataParams, SetUserDataParams, VerifyClaimParams } from '../src/index';
import config from './config';


describe('Claim module tests', () => {

    test('prepareUserData', () => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        const params: PrepareUserDataParams = { unpreparedUserData: config.userData.apuUnprepared };
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
                'general:givenName',
                'general:nationality',
                'address:state'
            ]
        };

        const claimObject = claim.createClaim(params2);


        expect(JSON.stringify(claimObject.userData[0])).toBe(JSON.stringify(config.userData.apu[0])); // general:givenName
        expect(JSON.stringify(claimObject.userData[1])).toBe(JSON.stringify(config.userData.apu[2])); // general:nationality
        expect(JSON.stringify(claimObject.userData[2])).toBe(JSON.stringify(config.userData.apu[7])); // address:state

        expect(claimObject.hashes.rootHash).toBe(config.hashes.apu.rootHash);
        expect(claimObject.hashes.leafHashes.length).toBe(6);

        expect(claimObject.hashes.leafHashes[0]).toBe(config.hashes.apu.leafHashes[1]); // general:surName
        expect(claimObject.hashes.leafHashes[1]).toBe(config.hashes.apu.leafHashes[3]); // birth:date
        expect(claimObject.hashes.leafHashes[2]).toBe(config.hashes.apu.leafHashes[4]); // birth:place
        expect(claimObject.hashes.leafHashes[3]).toBe(config.hashes.apu.leafHashes[5]); // address:city
        expect(claimObject.hashes.leafHashes[4]).toBe(config.hashes.apu.leafHashes[6]); // address:zip
        expect(claimObject.hashes.leafHashes[5]).toBe(config.hashes.apu.leafHashes[8]); // address:countryCode
    });


    test('verifyClaim success', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'general:givenName',
                'birth:date',
                'address:countryCode'
            ]
        };

        const claimObject = claim.createClaim(params2);


        const param3: VerifyClaimParams = { claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeTruthy();
    });


    test('verifyClaim different user data error', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'general:givenName',
                'birth:date',
                'address:countryCode'
            ]
        };

        const claimObject = claim.createClaim(params2);
        claimObject.userData[0].nonce = '42';


        const param3: VerifyClaimParams = { claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeFalsy();
    });


    test('verifyClaim different leaf hash error', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'general:givenName',
                'birth:date',
                'address:countryCode'
            ]
        };

        const claimObject = claim.createClaim(params2);
        claimObject.hashes.leafHashes[0] = '42';


        const param3: VerifyClaimParams = { claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeFalsy();
    });


    test('verifyClaim different root hash error', () => {
        const params1: SetUserDataParams = { userData: config.userData.apu };
        claim.setUserData(params1);


        const params2: CreateClaimParams = {
            userDataNames: [
                'general:givenName',
                'birth:date',
                'address:countryCode'
            ]
        };

        const claimObject = claim.createClaim(params2);
        claimObject.hashes.rootHash = '42';


        const param3: VerifyClaimParams = { claimObject };
        const valid = claim.verifyClaim(param3);


        expect(valid).toBeFalsy();
    });

});