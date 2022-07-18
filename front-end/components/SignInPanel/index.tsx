import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _CONF from 'common/config'


require('dotenv').config();
interface SignInForm {
  username: string;
  password: string;
}

function SignInPanel() {
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
        /^[a-zA-Z0-9_.-]*$/,
        'Username must not contain special character like @#$^...'
      ),
    password: yup
      .string()
      .min(8, 'Password must have 8-16 character')
      .max(316, 'Password must have 8-16 character')
      .required('Password must not be empty')
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        'Password must not contain special character like @#$^...'
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    // post api here
    try {
      const res = await axios.post(_CONF.DOMAIN + 'api/auth/sign-in', data);
      setErrorMessage({
        trigger: false,
        message: '',
      })
    } catch (error: any) {
      setErrorMessage({trigger: true, message: error.response.data.error})
    }
    // reset()
  };
  return (
    <div className='form'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign in</h2>
        <input
          {...register('username')}
          placeholder='Enter your username'
          type='text'
          required
        />
        {errors.username && <p>{errors.username.message}</p>}
        <br />
        <input
          {...register('password')}
          placeholder='Enter your password'
          type='password'
          required
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />
        {errorMessage.trigger && <p>{errorMessage.message}</p>}
        <button type='submit'>Đăng nhập</button>
      </form>
    </div>
  );
}

export default SignInPanel;
