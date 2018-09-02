import YuqueApi from '../../src/services/api/api';
import { RepoPublicType, RepoType, DocumentPublicType } from '../../src/enums';

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
        token: '48B9VGXvPsEx9z5ZLhf7KYaj8CvmrV25mdHu7mQh',
    });


    beforeEach(async () => {
        let reposList = await 语雀接口.reposService.getUserRepos(测试用户.id, {
            include_membered: false
        });
        while (reposList.length > 0) {
            for (let i = 0; i < reposList.length; i++) {
                await 语雀接口.reposService.deleteRepos(reposList[i].id);
            }
            reposList = [];
        }
    });

    test('测试用户信息相关接口', async () => {
        const 用户信息 = await 语雀接口.userService.getUser();
        expect(用户信息).toEqual(测试用户);
    });

    test('测试创建仓库与根据获取仓库', async () => {
        const repoToCreate = [
            {
                userid: 测试用户.id,
                repoConfig: {
                    name: 'repo-public-book',
                    public: RepoPublicType.PUBLIC,
                    slug: 'repo-public-book',
                    description: 'repo-public-book',
                    type: RepoType.BOOK,
                }
            },
            {
                userid: 测试用户.id,
                repoConfig: {
                    name: 'repo-public-design',
                    public: RepoPublicType.PUBLIC,
                    slug: 'repo-public-design',
                    description: 'repo-public-design',
                    type: RepoType.DESIGN,
                }
            },
            {
                userid: 测试用户.id,
                repoConfig: {
                    name: 'repo-private-book',
                    public: RepoPublicType.PRIVATE,
                    slug: 'repo-private-book',
                    description: 'repo-public-book',
                    type: RepoType.BOOK,
                }
            },
            {
                userid: 测试用户.id,
                repoConfig: {
                    name: 'repo-private-design',
                    public: RepoPublicType.PRIVATE,
                    slug: 'repo-private-design',
                    description: 'repo-private-design',
                    type: RepoType.DESIGN,
                }
            }
        ];
        for (let i = 0; i < repoToCreate.length; i++) {
            const 创建后返回的仓库信息 = await 语雀接口.reposService.createUsersRepos(repoToCreate[i]);
            expect(创建后返回的仓库信息.id > 0).toBe(true);
        }
        const 总文档列表 = await 语雀接口.reposService.getUserRepos(测试用户.id, {
            include_membered: false
        });
        expect(总文档列表.length).toBe(repoToCreate.length);


        let 文档列表 = await 语雀接口.reposService.getUserRepos(测试用户.id, {
            type: RepoType.BOOK,
            include_membered: false
        });

        expect(文档列表.length).toBe(repoToCreate.filter(o => { return o.repoConfig.type === RepoType.BOOK }).length);

        let 画板列表 = await 语雀接口.reposService.getUserRepos(测试用户.id, {
            type: RepoType.BOOK,
            include_membered: false
        });

        expect(画板列表.length).toBe(repoToCreate.filter(o => { return o.repoConfig.type === RepoType.DESIGN }).length);
    });

    test('根据 id/namespace 来删除', async () => {
        let reposList = await 语雀接口.reposService.getUserRepos(测试用户.id, {
            include_membered: false
        });
        while (reposList.length > 0) {
            for (let i = 0; i < reposList.length; i++) {
                if (i % 2 === 0) {
                    await 语雀接口.reposService.deleteRepos(reposList[i].id);
                } else {
                    await 语雀接口.reposService.deleteRepos(reposList[i].namespace);
                }
            }
            reposList = [];
        }
        const 总文档列表 = await 语雀接口.reposService.getUserRepos(测试用户.id, {
            include_membered: false
        });
        expect(总文档列表.length).toBe(0);
    });

    test('测试文档相关接口', async () => {
        const repoData = await 语雀接口.reposService.createUsersRepos({
            userid: 测试用户.id,
            repoConfig: {
                name: 'repo-public-book',
                public: RepoPublicType.PUBLIC,
                slug: 'repo-public-book',
                description: 'repo-public-book',
                type: RepoType.BOOK,
            }
        });
        const documentToCreate = [{
            title: 'document-public',
            body: `document-public`,
            slug: 'document-public',
            expectHtml: '<p>document-public</p>\n',
            public: DocumentPublicType.PUBLIC
        }, {
            title: 'document-private',
            body: `document-private`,
            slug: 'document-private',
            expectHtml: '<p>document-private</p>\n',
            public: DocumentPublicType.PRIVATE
        }];

        for (let i = 0; i < documentToCreate.length; i++) {
            const doc = documentToCreate[i];
            const result = await 语雀接口.documentService.createDocument(repoData.id, doc);
            expect(result.title).toEqual(doc.title);
            expect(result.public).toEqual(doc.public);
            expect(result.body).toEqual(doc.body);

            const 创建后返回的文档 = await 语雀接口.documentService.getDocumentDetail(repoData.id, result.id);
            expect(result.public).toEqual(创建后返回的文档.public);
            expect(result.title).toEqual(创建后返回的文档.title);
            expect(创建后返回的文档.body_html).toBe(doc.expectHtml);
            expect(result.body).toEqual(创建后返回的文档.body);
            expect(创建后返回的文档.id > 0).toBe(true);
        }


        // 命名真简单
        // 测试用 repo Id 获取文档列表
        const 用ID获取的文档列表 = await 语雀接口.documentService.getDocumentsList(repoData.id);
        expect(用ID获取的文档列表.length).toBe(documentToCreate.length);

        // 卧槽 测试没过。语雀创建文档没有 返回 namespace 好坑啊。
        // 测试用 repo Id 获取文档列表
        // const 用NameSpace获取的文档列表 = await 语雀接口.documentService.getDocumentsList(repoData.namespace);
        // expect(用NameSpace获取的文档列表.length).toBe(documentToCreate.length);
        const namespace = await 语雀接口.reposService.getRepoDetails(repoData.id)
            .then(re => { return re.namespace });

        const 用NameSpace获取的文档列表 = await 语雀接口.documentService.getDocumentsList(namespace);
        expect(用NameSpace获取的文档列表.length).toBe(documentToCreate.length);



        for (let i = 0; i < 用NameSpace获取的文档列表.length; i++) {
            const 文档 = 用NameSpace获取的文档列表[i];
            await 语雀接口.documentService.deleteDocument(repoData.id, 文档.id);
        }

        const 删除后的文件列表 = await 语雀接口.documentService.getDocumentsList(repoData.id);

        expect(删除后的文件列表.length).toBe(0);
    });

});
