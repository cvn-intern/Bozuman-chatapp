import React from "react";
import { useForm, SubmitHandler  } from "react-hook-form";
import * as yup from "yup";
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
        <h2>Sign in</h2>
        <label> Username </label>
        <input
          {...register("username")}
          placeholder="Type your username"
          type="text"
          required
        />
        {errors.username && <p>{errors.username.message}</p>}
        <label> Password </label>
        <input
          {...register("password")}
          placeholder="Type your password"
          type="password"
          required
        />
        <label>
          <input type="checkbox"/>
          Remember me
        </label>
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default SignInPanel;
