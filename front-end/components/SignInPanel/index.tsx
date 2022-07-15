import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _CONF from 'config/config';
import { useRouter } from 'next/router';
// import cookieCutter from 'cookie-cutter' // I dont know why it doesn't work
const cookie = require('cookie-cutter');

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
    formState: { errors },
    reset,
  } = useForm<SignInForm>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    try {
      const res = await axios.post(_CONF.DOMAIN + 'api/auth/sign-in', data);
      setErrorMessage({
        trigger: false,
        message: '',
      });
      cookie.set('access_token', res.data.accessToken);
      window.localStorage.setItem('refresh_token', res.data.refreshToken);
      router.push('/');
    } catch (error: any) {
      setErrorMessage({ trigger: true, message: error.response.data.error });
    }
    // reset()
  };
  return (
    <div className='signin'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign in</h2>
        <label className='info'> Username </label>
        <input
          {...register('username')}
          placeholder='Type your username'
          type='text'
          required
        />
        {errors.username && <p>{errors.username.message}</p>}
        <label className='info'> Password </label>
        <input
          {...register('password')}
          placeholder='Type your password'
          type='password'
          required
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />
        {errorMessage.trigger && <p>{errorMessage.message}</p>}
        <div>
          <label className='remember-me'>
            <input type='checkbox' />
            <span>Remember me</span>
          </label>
          <a>Forgot password?</a>
        </div>
        <button type='submit' className='button__signin'>
          Continue
        </button>
        <p className='mt-4 mb-0'>Sign in with Google</p>
        <a href='' className='mt-2  '>
          <Image
            src={'/icon-google.png'}
            alt='google icon'
            width={20}
            height={20}
          />
        </a>
        <div>
          <p>Don&apos;t have an account?</p>
          <button className='button__signup'>Create new</button>
        </div>
      </form>
    </div>
  );
}

export default SignInPanel;
