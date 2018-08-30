import { AxiosInstance } from 'axios';
import * as qs from 'qs';
import { RepoPublicType, RepoType } from '../../enums';

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

export interface ReposService {
    createUsersRepos(
        createUsersReposRequest: CreateUsersReposRequest,
    ): Promise<any>;
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
}
