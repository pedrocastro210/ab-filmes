import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { UserTokenStore } from "../services/user-token-store";
import { UserApi } from "../services/user-api";

export const guestGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
    const userTokenStore = inject(UserTokenStore);
    const userApi = inject(UserApi);
    const router = inject(Router);

    const HAS_TOKEN = userTokenStore.hasToken();
    if(!HAS_TOKEN) return true;

    const exploreRoute = router.createUrlTree(['/']);

    return exploreRoute;
}