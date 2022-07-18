import React from "react";
import { useForm, SubmitHandler  } from "react-hook-form";
import * as yup from "yup";
import Image from 'next/image';
import { yupResolver } from "@hookform/resolvers/yup";

interface SignInForm {
  username: string;
  password: string;
}

function SignInPanel() {

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(8, "Username must have 8-32 character")
      .max(32, "Username must have 8-32 character")
      .required("Username must not be empty")
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "Username must not contain special character like @#$^..."
      ),
    password: yup
      .string()
      .min(8, "Password must have 8-16 character")
      .max(316, "Password must have 8-16 character")
      .required("Password must not be empty")
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "Password must not contain special character like @#$^..."
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
  const onSubmit: SubmitHandler<SignInForm> = data => {
    console.log(data);
    reset()
  } 
  return (
    <div className="signin">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>SIGN IN</h2>
        <label className='info'> Username </label>
        <input
          {...register("username")}
          placeholder="Type your username"
          type="text"
          required
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <label className='info'> Password </label>
        <input
          {...register("password")}
          placeholder="Type your password"
          type="password"
          required
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <div>
          <label className="remember-me">
            <input type="checkbox"/>
            <span>Remember me</span>
          </label>
          <a>Forgot password?</a>
        </div>
        <button type="submit" className="button__signin">Continue</button>
        <p className="mt-4 mb-0">Sign in with Google</p> 
        <a href="" className="mt-2  ">
          <Image
            src={'/icon-google.png'}
            alt="google icon"
            width={20}
            height={20}
          />
        </a>
        <div>
          <p>Don't have an account?</p>
          <button type="submit" className="button__signup">Create new</button>
        </div>
      </form>
    </div>
  );
}

export default SignInPanel;
