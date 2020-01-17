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

const config = {
    userData: {
        apuUnprepared: [
            { name: 'general:givenName',    value: 'apu' },
            { name: 'general:surName',      value: 'nahasapeemapetilon' },
            { name: 'general:nationality',  value: 'american' },
            { name: 'birth:date',           value: '04.02.1942' },
            { name: 'birth:place',          value: 'rahmatpur' },
            { name: 'address:city',         value: 'springfield' },
            { name: 'address:zip',          value: '422442' },
            { name: 'address:state',        value: 'illinois' },
            { name: 'address:countryCode',  value: 'us' }
        ],
        apu: [
            { name: 'general:givenName',    value: 'apu',                   nonce: '2LqyL4UHmjNFd2UfykUud7niemEEyUBSfAYvTKMKX6ipM37G6Fk94AtCqlFHJOHr' },
            { name: 'general:surName',      value: 'nahasapeemapetilon',    nonce: 'WNTZLpacUsMYYhfZdmsn2UwvAMay6zcDEgWwSdUYYzNNssvCkmyQVm6jd6ATfmTj' },
            { name: 'general:nationality',  value: 'american',              nonce: 'ODUVizex9PEkFG63ZVI7h4Ae6qyj5tYK5iZ9bpOjpHXx1dJhkoLELNHvOOtHIQmq' },
            { name: 'birth:date',           value: '04.02.1942',            nonce: '7LqA72Nqw1ONeQNCKUoub6GnnjrjqeX8wCS5UdjyfERMBIpvMbHOhY6FbNUvK3Hr' },
            { name: 'birth:place',          value: 'rahmatpur',             nonce: '0rc71Das18a7blLvL2warMpiaw5Q7PsXq8EgEmFBqcDbsZFxmNshRHfbbxuEtEi1' },
            { name: 'address:city',         value: 'springfield',           nonce: 'eBaiWBcw4AHaeI5pWcRasvaXJFaP0ApL1vOktdj30wH1fTSBvyHuEmGavtgfDwra' },
            { name: 'address:zip',          value: '422442',                nonce: '9WMkXLFFo2xdjkZDJYyMtVUm0YwUtnkireFRBdvHjeldUpue8nYFf6lBojHzrlYB' },
            { name: 'address:state',        value: 'illinois',              nonce: 'gI9dDBoOqT2Vt04Hmbi59tsZuvyCSLNfPRmlJxeU4IiZN4FdsIZJEvU9RNyNJa9i' },
            { name: 'address:countryCode',  value: 'us',                    nonce: 'EnYg7EpDzOSPJM3QVfi0DtKmgwiYX4slAv5zNPmenSXiM5PSPAz03PfNI5C1XEDV' }
        ]
    },
    hashes: {
        apu: {
            rootHash: '9eb00fd0e01dbb903ce6512fe0c8612692b60724e0b2d7a41891f5666912153e',
            leafHashes: [
                '2062f74d687e4d8498116de9ea9a63f89b2b98b5442989c474088d27da618300',
                '783fd6868618d40f86aec0d3468fb15a1aa6464d0bd34eea9478b8d3637becd8',
                'e665592df0614a0c6d837145b94887ed80d450a365a46e93cfed00fca91ac54d',
                'd206b3681eed1dc610bfb337289056dcf923e95c92ae7b5d4dad602b9f35f0e9',
                'b873d6e588d7642693b49cb55d93a53fd83afed045452b41c189876cae8c3e02',
                '41c09ec51d6f373edf20559e929029a44e68fa80d3bafdb44e41d6551562c27f',
                'c408700b01a0f7129ef44b2257dac882721cdb2795ed7a74698f5e2b12b13139',
                'e68fcaaa6f8e5801bc1870ddd5c8e1f585cbf91ca481c2afd96404a4d6a11993',
                'ae8934aca3733e086240141dee61233bdb8b06b7836f01c78e37ac089b3be7ab'
            ]
        }
    }
};


export default config;