import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IUserTokenSuccessAuthResponse } from "../../shared/models/user-token-success-auth-response";
import { IUserLoginOrRegisterSuccessResponse } from "../../shared/models/user-login-or-register-success-response";
import { tap } from "rxjs";
import { UserTokenStore } from "./user-token-store";
import { UserInfosStore } from "./user-infos-store";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class UserApi {
    private readonly _httpClient = inject(HttpClient);
    private readonly _userTokenStore = inject(UserTokenStore);
    private readonly _userInfosStore = inject(UserInfosStore);

    validateToke() {
        return this._httpClient.get<IUserTokenSuccessAuthResponse>(environment.baseUrl + '/users/validate-token');
    };

    login(email: string, password: string) {

        return this._httpClient.post<IUserLoginOrRegisterSuccessResponse>(environment.baseUrl + '/users/login', {
            email,
            password
        }).pipe(
            tap(({ user }) => this._userInfosStore.setUserInfos(user)),
            tap((loginResponse) => this._userTokenStore.saveToken(loginResponse.token))
        );
    };

    register(name: string, email: string, password: string) {
        return this._httpClient.post<IUserLoginOrRegisterSuccessResponse>(environment.baseUrl + '/users', {
            name,
            email,
            password
        });
    };
}