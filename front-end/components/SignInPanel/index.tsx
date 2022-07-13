import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function SignInPanel() {
  interface SignInForm {
    username: string;
    password: string;
  }
  const schema = yup.object().shape({
    username: yup
      .string()
      .min(8, "Username must have 8-30 character")
      .max(30, "Username must have 8-30 character")
      .required("Username must not be empty")
      .matches(
        /^[aA-zZ\s]+$/,
        "Username must not contain special character like @#$^..."
      ),
    password: yup
      .string()
      .min(8, "Password must have 8-30 character")
      .max(30, "Password must have 8-30 character")
      .required("Password must not be empty")
      .matches(
        /^[aA-zZ\s]+$/,
        "Password must not contain special character like @#$^..."
      ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    // errors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = (data: any) => {
    console.log({ data });
    console.log(errors);
    console.log("1");
    // reset();
  };
  return (
    <div className="form">
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <h2>Sign in</h2>
        <input
          {...register("username")}
          placeholder="Enter your username"
          type="text"
          required
        />
        {/* {errors.username && <p>{errors.username.message}</p>} */}
        <br />

        <input
          {...register("password")}
          placeholder="Enter your password"
          type="password"
          required
        />
        <br />

        <button type="submit">Đăng nhập</button>
        {/* <input type="submit" value="submit" /> */}
      </form>
    </div>
  );
}

export default SignInPanel;
