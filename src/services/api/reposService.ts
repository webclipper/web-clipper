import { AxiosInstance } from 'axios';
import * as qs from 'qs';
import { RepoPublicType, RepoType } from '../../enums';
import * as _ from 'lodash';

export interface ReposConfig {
    name: string;
    public: RepoPublicType;
    description?: string;
    type: RepoType;
}

export interface CreateUsersReposRequest {
    userid: number;
    repoConfig: ReposConfig;
}

export interface BookSerializer {
    id: number;
    type: RepoType;
    name: string;
    namespace: string;
    user_id: string; // 所属的团队/用户编号
    public: RepoPublicType;
}

export interface ReposService {
    createUsersRepos(
        createUsersReposRequest: CreateUsersReposRequest,
    ): Promise<any>;

    getUserRepos(userid: number): Promise<BookSerializer[]>;

    getUserRepos(login: string): Promise<BookSerializer[]>;
}


export class ReposServiceImpl implements ReposService {
    private request: AxiosInstance;

    constructor(req: AxiosInstance) {
        this.request = req;
    }

    public async createUsersRepos(
        createUsersReposRequest: CreateUsersReposRequest,
    ): Promise<any> {
        return this.request.post(`/users/${createUsersReposRequest.userid}/repos`,
            qs.stringify(createUsersReposRequest.repoConfig), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        ).then((re) => {
            return Promise.resolve(re);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }


    public async getUserRepos(input: string | number): Promise<BookSerializer[]> {
        return this.request.get(`/users/${input}/repos`).then(
            re => {
                if (!_.isEmpty(re.data) && _.isArray(re.data)) {
                    return Promise.resolve(re.data);
                }
                return Promise.resolve([]);
            }
        ).catch((err) => {
            return Promise.reject(err);
        });
    }

}
