import { entity, GetEntityResponse } from '@somedotone/attestation-protocol-ts'


export const func = async(): Promise<GetEntityResponse>  => {
    return await entity.getEntity('https://testardor.some.one', {
        account: 'ARDOR-4TGA-X2NT-875X-BH5X5',
        attestationContext: 'somedotone-attestation-demo',
        attestor: 'ARDOR-5TT2-VS3T-EUTS-7WDBA'
    });
};

