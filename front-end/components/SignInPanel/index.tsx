<<<<<<< HEAD
/* eslint-disable */

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _CONF from 'config/config';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import AuthPanel from 'components/AuthPanel';
=======
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import _CONF from 'config/config'
import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'
import AuthPanel from 'components/AuthPanel'
>>>>>>> 1b453de1e6e1481f9e8ededd97afa6b4a2f2ca86

interface SignInForm {
  username: string;
  password: string;
}

function SignInPanel() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState({
    trigger: false,
    message: '',
  });
  const schema = yup.object().shape({
    username: yup
      .string()
      .min(8, 'Username must have 8-32 character')
      .max(32, 'Username must have 8-32 character')
      .required('Username must not be empty')
      .matches(
        _CONF.REGEX_USENAME_PASSWORD,
        'Username must not contain special character like @#$^...'
      ),
    password: yup
      .string()
      .min(8, 'Password must have 8-16 character')
      .max(16, 'Password must have 8-16 character')
      .required('Password must not be empty')
      .matches(
        _CONF.REGEX_USENAME_PASSWORD,
        'Password must not contain special character like @#$^...'
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/sign-in',
        data
      );
      setErrorMessage({
        trigger: false,
        message: '',
      });
      setCookie('access_token', res.data.accessToken);
      setCookie('refresh_token', res.data.refreshToken);
      router.push('/');
    } catch (error: any) {
      setErrorMessage({
        trigger: true,
        message: error.response.data.error.message,
      });
    }
    reset({ password: '' });
  };
  return (
    <AuthPanel>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign in</h2>
        <label className="info"> Username </label>
        <input
          {...register('username')}
          placeholder="Type your username"
          type="text"
          required
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <label className="info"> Password </label>
        <input
          {...register('password')}
          placeholder="Type your password"
          type="password"
          required
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <br />
        {errorMessage.trigger && (
          <p className="error">{errorMessage.message}</p>
        )}
        <div>
          <Link href="/forgot-password">
            <a>Forgot password?</a>
          </Link>
        </div>
        <button type="submit" className="button__signin">
          Continue
        </button>
        <div className="linkToSignup">
          <p>Don&apos;t have an account?</p>
          <button className="button__signup">
            <Link href="/sign-up">
              <a>Create new</a>
            </Link>
          </button>
        </div>
      </form>
    </AuthPanel>
  );
}

export default SignInPanel;
