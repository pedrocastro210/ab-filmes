export interface IUserLoginOrRegisterSuccessResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};