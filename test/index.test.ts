import { func } from '../src/index'

test('demo test', async () => {
    try {
        const resp = func();
        expect(resp).toBeDefined();
    } catch (e) {
        fail('should not reach here');
    }
});