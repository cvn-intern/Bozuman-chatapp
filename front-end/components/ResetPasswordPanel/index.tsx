/* eslint-disable */

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
// import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _CONF from 'config/config';
import { useRouter } from 'next/router';
import { GoSignIn } from 'react-icons/go';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

function ResetPasswordPanel() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState({
    trigger: false,
    message: '',
  });

  const schema = yup.object().shape({
    code: yup
            .number()
            .required()
            .min(6, 'Code must be 6 digit')
            .max(6, 'Code must be 6 digit'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(schema),
  });

  const onBackSignIn = (e : any) => {
    e.preventDefault();
    router.push('/sign-in');
  }

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/forgot-password', data);
      // setErrorMessage({
      //   trigger: false,
      //   message: '',
      // });
      // router.push('/');
    } catch (error: any) {
      setErrorMessage({ trigger: true, message: error.response.data.error.message });
    }
    // reset()
  };
  return (
    <div className='forgotpassword'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='header d-flex justify-content-between align-item-center'>
          <h2>Reset password</h2>
          <button 
            className='goSignIn'
            onClick={onBackSignIn}
          >
            <GoSignIn />
          </button>
        </div>
        <input
          {...register('password')}
          placeholder='Enter new passowrd'
          type='password'
          required
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />
        <input
          {...register('password')}
          placeholder='Enter confirm passowrd'
          type='password'
          required
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        <br />
        {errorMessage.trigger && <p>{errorMessage.message}</p>}
        
        <button type='submit' className='button__search'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default ResetPasswordPanel;
