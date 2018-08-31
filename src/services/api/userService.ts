import { AxiosInstance } from 'axios';

export interface UserProfile {
    id: number;
    avatar_url: string;
    name: string;
}

export interface UserService {
    getUser(): Promise<UserProfile>;
}



export class UserServiceImpl implements UserService {
    private request: AxiosInstance;

    constructor(req: AxiosInstance) {
        this.request = req;
    }

    public async getUser(): Promise<UserProfile> {
        return this.request
            .get('/user')
            .then((result) => {
                return Promise.resolve({
                    avatar_url: result.data.avatar_url,
                    id: result.data.id,
                    name: result.data.name,
                });
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
}
