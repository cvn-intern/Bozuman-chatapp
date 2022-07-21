import React, { MouseEvent, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _CONF from 'config/config';
import { useRouter } from 'next/router';
import { FaSignInAlt } from 'react-icons/fa';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

function ResetPasswordPanel() {
  const router = useRouter();
  const { email } = router.query;

  const [errorMessage, setErrorMessage] = useState({
    trigger: false,
    message: '',
  });

  const schema = yup.object().shape({
    password: yup
      .string()
      .min(8, 'Password must have 8-16 character')
      .max(16, 'Password must have 8-16 character')
      .required('New password must not be empty')
      .matches(
        _CONF.REGEX_USENAME_PASSWORD,
        'Password must not contain special character like @#$^...'
      ),
    confirmPassword: yup
      .string()
      .min(8, 'Confirm password must have 8-16 character')
      .max(16, 'Confirm password must have 8-16 character')
      .required('Confirm password must not be empty')
      .oneOf(
        [yup.ref('password'), null],
        'Confirm password does not match with new password'
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onBackSignIn = (e: MouseEvent) => {
    e.preventDefault();
    router.push('/sign-in');
  };

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    try {
      const { password } = data;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/reset-password`,
        {
          email,
          password,
        }
      );

      if (res.status === 200) {
        setErrorMessage({
          trigger: false,
          message: '',
        });

        router.push('/sign-in');
      }
    } catch (error: any) {
      setErrorMessage({
        trigger: true,
        message: error.response.data.error.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="header d-flex justify-content-between align-item-center">
        <h2>Reset password</h2>
        <button className="goSignIn" onClick={onBackSignIn}>
          <FaSignInAlt />
        </button>
      </div>
      <input
        {...register('password')}
        placeholder="Enter new passowrd"
        type="password"
        required
      />
      <div className="errorMessage">
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <input
        {...register('confirmPassword')}
        placeholder="Enter confirm passowrd"
        type="password"
        required
      />
      <div className="errorMessage">
        {(errors.confirmPassword && <p>{errors.confirmPassword.message}</p>) ||
          (errorMessage.trigger && <p>{errorMessage.message}</p>)}
      </div>
      <button type="submit" className="button__search">
        Submit
      </button>
    </form>
  );
}

export default ResetPasswordPanel;
