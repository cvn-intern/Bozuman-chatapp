/* eslint-disable */
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _CONF from 'common/config';

interface SignUpForm {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

function SignUpPanel() {
  const [err, setErr] = useState({ error: false, message: ''});

  const schema = yup.object().shape({
    fullName: yup
      .string()
      .min(8, 'Full name must have 8-50 character')
      .max(50, 'Full name must have 8-50 character')
      .required('Full name must not be empty')
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        'Username must not contain special character like @#$^...'
      ),
    email: yup.string().email('Email must be in correct format'),
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
    reset,
  } = useForm<SignUpForm>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    try {
      const res = await axios.post(_CONF.DOMAIN + 'api/auth/register', data).then((res) => {
        if (res.data == 'Username already exist') {
          setErr({ error: true, message: 'Username repeat' });
        } else if (res.data == 'Email already exist') {
          setErr({ error: true, message: 'Email repeat' });
        } else if (res.data == 'Create account success') {
          setErr({ error: false, message: 'Create account success' });
        }
      }
      )
      console.log(err);
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div className="form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>
        <input
          {...register('fullName')}
          placeholder='Enter your full name'
          type='text'
          required
        />
        {errors.fullName && <p>{errors.fullName.message}</p>}
        <br />
        <input
          {...register('email')}
          placeholder='Enter your email'
          type='text'
          required
        />
        {errors.email && <p>{errors.email.message}</p>}
        <br />
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
        {!err.error ? <></> : <><p>{err.message}</p><br /></>}
        <button type='submit'>CREATE ACCOUNT</button>
      </form>
    </div>
  );
}

export default SignUpPanel;
