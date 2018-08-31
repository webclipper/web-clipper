
import axios from 'axios';
import { UserService, UserServiceImpl } from './userService';
import { ReposService, ReposServiceImpl } from './reposService';
import { DocumentService, DocumentServiceImpl } from './documentService';


export interface YuqueConfigServer {
    baseURL: string;
    token: string;
}

export default class YuqueApi {

    public userService: UserService;
    public reposService: ReposService;
    public documentService: DocumentService;


    constructor(config: YuqueConfigServer) {
        const request = axios.create({
            baseURL: config.baseURL,
            headers: {
                'X-Auth-Token': config.token,
            },
            timeout: 10000,
            transformResponse: [(data): any => {
                // 做任何你想要的数据转换
                return JSON.parse(data).data;
            }],
            withCredentials: true,
        });

        this.userService = new UserServiceImpl(request);
        this.reposService = new ReposServiceImpl(request);
        this.documentService = new DocumentServiceImpl(request);
    }
}
