import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { doctorLogin } from "@/services/doctorService";
import errorMessage from "@/utils/errorCode";

import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";

const FormSchema = zod.object({
  email: zod.string().trim().email({ message: "Enter email in correct format" }),
  password: zod.string().trim().min(1, { message: "Password Required" }),
});

/**
 * This form component used to get the doctor email and password and then login
 * @returns auth form for doctor
 */
export const DoctorAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");

  const navigation = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * to clear the error message displayed in error component when getting error from api ,when user change value in form 
   */
  useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMessageDisplay("");
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  /**
   * This function used to login
   * @param {*} data object with doctor details
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await doctorLogin(data);
      localStorage.accessToken = res?.data.accessToken;
      localStorage.refreshToken = res?.data.refreshToken;
      localStorage.role = "doctor";
      navigation("/");
      setIsLoading(false);
    } catch (error) {
      setErrorMessageDisplay(
        errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong."
      );
      setIsLoading(false);
    }
  };
  /**
   * function to show password that is hidden in the input field
   */
  const handleShowPassword = () => {
    setShowPassword((el) => !el);
  };
  return (
    <div className={"grid gap-6"} >
      <Form {...form} >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-1"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex justify-end">
                    <Input
                      placeholder="*****"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute flex mt-1 mr-1"
                      onClick={handleShowPassword}
                    >
                      {showPassword ? (
                        <Eye className="w-5" />
                      ) : (
                        <EyeOff className="w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
          <div className="flex justify-end">
            <NavLink
              to="/forgot-password"
              className="underline underline-offset-4 w-max"
            >
              Forgot Password
            </NavLink>
          </div>
          <ErrorDisplay message={errorMessageDisplay} />
        </form>
      </Form>
    </div>
  );
};
