import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { IRegisterParams } from '../../models/register-params';
import { UserApi } from '../../../../core/services/user-api';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { confirmPassword } from '../../validators/confirm-password';

@Component({
  selector: 'app-register-user-form',
  imports: [FormField],
  templateUrl: './register-user-form.html',
  styleUrl: './register-user-form.css',
})
export class RegisterUserForm {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);

  registerModel = signal<IRegisterParams>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.name, { message: 'O nome é obrigatório.' });

    required(fieldPath.email, { message: 'O E-mail é obrigatório.' });
    email(fieldPath.email, { message: 'O E-mail está invalido.' });

    required(fieldPath.password, { message: 'A senha é obrigatória.' });
    minLength(fieldPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres.' });

    confirmPassword(fieldPath.confirmPassword, fieldPath.password);
  });

  registerParams = signal<IRegisterParams | undefined>(undefined);

  registerResource = rxResource({
    params: () => this.registerParams(),
    stream: ({ params }) => this._userApi.register(params.name , params.email, params.password).pipe(tap(() => this._router.navigate(['/login']))),
  });

  registerError = computed(() => {
    const err = this.registerResource.error();
    return setErrorMessage(err instanceof HttpErrorResponse ? err : undefined);
  });

  successMessage = computed(() => {
    const SUCCESS_REGISTRATION = this.registerResource.hasValue();

    return SUCCESS_REGISTRATION ? 'Usuário cadastrado com sucesso!' : undefined;
  });

  register() {
    const credentials = this.registerForm().value();

    this.registerParams.set(credentials);
  }
};
