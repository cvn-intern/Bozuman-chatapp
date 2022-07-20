/* eslint-disable */

import React, { MouseEvent, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import _CONF from 'config/config';
import { useRouter } from 'next/router';
import { FaSignInAlt } from 'react-icons/fa';

interface EnterCodeForm {
  code: string;
}

function EnterCodePanel() {
  const router = useRouter();
  const { email } = router.query;

  const [errorMessage, setErrorMessage] = useState({
    trigger: false,
    message: '',
  });

  const schema = yup.object().shape({
    code: yup
            .string()
            .required()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .min(6, 'Code must be 6 digits')
            .max(6, 'Code must be 6 digits'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnterCodeForm>({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onBackSignIn = (e : MouseEvent) => {
    e.preventDefault();
    router.push('/sign-in');
  }

  const onSubmit: SubmitHandler<EnterCodeForm> = async (data) => {
    try {
      const { code } = data;
      const res = await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/check-code`, {
        email,
        code: code.toString(),
      });

      if(res.status === 200) {
        setErrorMessage({
          trigger: false,
          message: '',
        });
      }

    } catch (error: any) {
      setErrorMessage({ 
        trigger: true,
        message: error.response.data.error.message 
      });
    }
  };
  return (
    <div className='forgotpassword'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='header d-flex justify-content-between align-item-center'>
          <h2>Enter code</h2>
          <button 
            className='goSignIn'
            onClick={onBackSignIn}
          >
            <FaSignInAlt />
          </button>
        </div>
        <input
          {...register('code')}
          className='code'
          type='text'
          required
        />
        <div className='errorMessage'>
        {(errors.code && <p>{errors.code.message}</p>) ||
        (errorMessage.trigger && <p>{errorMessage.message}</p>)}
        </div>
        
        <button type='submit' className='button__search'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default EnterCodePanel;
