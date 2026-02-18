import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../../lib/validationSchemas/authSchema";
import { Input, Button } from "@heroui/react";
import { loginService } from "../../../services/authServices";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../components/AuthContext/AuthContextProvider";

export default function Login() {
  const [isShowPass, setIsShowPass] = useState(false);
  const { token, setToken, isAuthReady } = useContext(AuthContext);
  const navigate = useNavigate();
  



  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const submit = async (data) => {
    try {
      const response = await loginService(data);
      toast.success(response.data.message);
      setToken(response.data.token);
      navigate("/profile");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
  return (
    <>
      <h2 className="text-3xl font-bold my-2">
        Welcome to Our Socail Media Login Form
      </h2>
      <p className="text-gray-500 text-lg font-semibold my-2">
        Please Fill In This Form To Login
      </p>
      <form onSubmit={handleSubmit(submit)} className="max-w-4xl mx-auto">
        <div className="form-body md:w-[90%] lg:w-[70%] mb-8">
          <Input
            {...register("email")}
            label="Email"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            type="email"
            variant="bordered"
            className="pb-4"
            classNames={{ inputWrapper: errors.email ? "border-red-600" : "" }}
          />
          <Input
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            label="Password"
            type={isShowPass ? "text" : "password"}
            variant="bordered"
            className="pb-4"
            endContent={
              isShowPass ? (
                <LuEyeClosed
                  className="cursor-pointer text-[1.5rem] text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  onClick={() => setIsShowPass(!isShowPass)}
                />
              ) : (
                <LuEye
                  className="cursor-pointer text-[1.5rem] text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  onClick={() => setIsShowPass(!isShowPass)}
                />
              )
            }
            classNames={{
              innerWrapper: errors.password ? "border-red-600" : "",
            }}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full text-center cursor-pointer hover:bg-blue-700 transition-colors duration-300 py-2 rounded-lg bg-blue-600 text-white"
          >
            Login
          </Button>
        </div>
      </form>
    </>
  );
}
