import YuqueApi from '../../src/services/api/api';

//用中文写测试试试看
describe('测试语雀接口', () => {


    // 不要担心 这是小号测试号 为了方便先写代码里了
    const 测试用户 = {
        name: 'yuque-web-clipper',
        id: 165510,
        avatar_url: 'https://gw.alipayobjects.com/zos/rmsportal/wYnHWSXDmBhiEmuwXsym.png'
    };
    const 语雀接口 = new YuqueApi({
        baseURL: 'https://www.yuque.com/api/v2/',
        token: 'MFq8s26HCYI8bPkP5XjptwxTgSAhhpgh2EfcggFZ',
    });

    test('测试用户信息相关接口', async () => {
        const 用户信息 = await 语雀接口.userService.getUser();
        expect(用户信息).toEqual(测试用户);
    });
});
