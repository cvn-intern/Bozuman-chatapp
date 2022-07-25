const COUNT_DOWN_NUMBER = 60;

import React, { MouseEvent, useEffect, useLayoutEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaSignInAlt } from 'react-icons/fa';
import AuthPanel from 'components/AuthPanel';
import CountDown from 'components/CountDown';

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

  const [showResendBtn, setShowResendBtn] = useState(false);
  const [count, setCount] = useState(0);

  const schema = yup.object().shape({
    code: yup
      .string()
      .required('The code must not be empty')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(6, 'Code must be 6 digits')
      .max(6, 'Code must be 6 digits'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnterCodeForm>({
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onBackSignIn = (event: MouseEvent) => {
    event.preventDefault();
    router.push('/sign-in');
  };

  const onCreateCodeAgain = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/create-code`,
        {
          email,
        }
      );
      if (res.data.success) {
        sessionStorage.clear();
        setCount(COUNT_DOWN_NUMBER);
        setShowResendBtn(false);
      }
    } catch (error) {
      //TODO: Server error
    }
    reset({ code: '' });
  };

  const onSubmit: SubmitHandler<EnterCodeForm> = async (data) => {
    try {
      const { code } = data;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/check-code`,
        {
          email,
          code: code.toString(),
        }
      );

      if (res.data.sucess) {
        setErrorMessage({
          trigger: false,
          message: '',
        });
      }

      router.push({
        pathname: '/reset-password',
        query: {
          email: res.data.email,
        },
      });
    } catch (error: any) {
      setErrorMessage({
        trigger: true,
        message: error.response.data.error.message,
      });
    }
  };

  useLayoutEffect(() => {
    if (!sessionStorage.count) {
      setCount(COUNT_DOWN_NUMBER);
    } else if (Number(sessionStorage.count) !== 0) {
      setCount(Number(sessionStorage.count));
    }
  }, []);

  useEffect(() => {
    if (count === 0) {
      setShowResendBtn(true);
    } else {
      setShowResendBtn(false);
    }
  }, [count, showResendBtn]);

  return (
    <AuthPanel>
      <div className="header d-flex justify-content-between align-item-center">
        <h2>Enter code</h2>
        <button className="goSignIn" onClick={onBackSignIn}>
          <FaSignInAlt />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputCode d-flex">
          <input {...register('code')} className="code" type="text" required />
          <div className="countDown">
            <CountDown count={count} changeCount={setCount}/>
          </div>
        </div>
        <div className="errorMessage">
          {(errors.code && <p>{errors.code.message}</p>) ||
            (errorMessage.trigger && <p>{errorMessage.message}</p>)}
        </div>
        {showResendBtn && (
            <p className="resendCode" onClick={onCreateCodeAgain}>
              Didn&apos;t receive any code? Click here to resent
            </p>
          )}
        <button type="submit" className="button__search">
          Submit
        </button>
      </form>
    </AuthPanel>
  );
}

export default EnterCodePanel;
