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
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { doctorResetPassword } from "@/services/doctorService";
import { toast } from "../ui/use-toast";
import errorMessage from "@/utils/errorCode";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";

const passwordRegex =
  /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;
const FormSchema = zod.object({
  newPassword: zod
    .string()
    .trim()
    .min(6, { message: "New Password must contain at least 6 character(s)" })
    .max(15, { message: "New Password must contain at most 15 character(s)" })
    .refine(
      (value) => passwordRegex.test(value),
      "New password must contain at least one of each of the following: uppercase, lowercase, a special character, and a number."
    ),
  confirmPassword: zod
    .string()
    .trim()
    .min(6, {
      message: "Confirm Password must contain at least 6 character(s)",
    })
    .max(15, {
      message: "Confirm Password must contain at most 15 character(s)",
    })
    .refine(
      (value) => passwordRegex.test(value),
      "Confirm password must contain at least one of each of the following: uppercase, lowercase, a special character, and a number."
    ),
});

/**
 * This form component is used to reset the password of the doctor
 * @returns doctor reset password form component
 */
export const DoctorResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");

  const search = useSearchParams();
  const navigation = useNavigate();
  const _token = search[0].get("token");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  /**
   * if token is not found in the url, then page will be navigated to login page
   */
  useEffect(() => {
    if (_token === null || _token?.length === 0) navigation("/login");
  }, [_token, navigation]);

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
   * This function is used to send new password and token to server for reseting password
   * @param {*} data of the doctor with new password and confirm password
   * @returns 
   */
  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword)
        return setErrorMessageDisplay("Both password are not same");

      setIsLoading(true);
      let request = {
        token: _token,
        password: data.confirmPassword,
      };
      await doctorResetPassword(request);
      toast({
        variant: "success",
        title: "",
        description: "The password has been changed",
      });
      navigation("/login");
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
    <div className={"grid gap-6"}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-1"
        >
          <FormField
            control={form.control}
            name="newPassword"
            className="space-y-1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*****"
                    {...field}
                    type="password"
                    disabled={isLoading}
                  />
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
            <NavLink to="/login" className="underline underline-offset-4 w-min">
              Login
            </NavLink>
          </div>
          <ErrorDisplay message={errorMessageDisplay} />
        </form>
      </Form>
    </div>
  );
};
