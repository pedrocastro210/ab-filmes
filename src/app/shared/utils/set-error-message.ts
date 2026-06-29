import { HttpErrorResponse } from "@angular/common/http";

export const setErrorMessage = (error: HttpErrorResponse | undefined) => {
    if(!error) {
      return '';
    };

    if(error.status === 0) {
      return 'Sem conexão com a internet ou servidor offline.';
    };

    if(error.error?.message) {
      return error.error?.message as string;
    };

    return 'Ocorreu um erro inesperado ao tentar acessar.'
};