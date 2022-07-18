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

interface ForgotPasswordForm {
  email: string;
}

function ForgotPasswordPanel() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState({
    trigger: false,
    message: '',
  });

  const schema = yup.object().shape({
    email: yup.string().email('Email must be in correct format'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
  });

  const onBackSignIn = (e : any) => {
    e.preventDefault();
    router.push('/sign-in');
  }

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    try {
      console.log(process.env);
      const res = await axios.post(process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/forgot-password', data);
      console.log(res);
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
          <h2>Forgot password</h2>
          <button 
            className='goSignIn'
            onClick={onBackSignIn}
          >
            <GoSignIn />
          </button>
        </div>
        <input
          {...register('email')}
          placeholder='Type your email'
          type='email'
          required
        />
        {errors.email && <p>{errors.email.message}</p>}
        <br />
        {errorMessage.trigger && <p>{errorMessage.message}</p>}
        
        <button type='submit' className='button__search'>
          Search
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordPanel;
