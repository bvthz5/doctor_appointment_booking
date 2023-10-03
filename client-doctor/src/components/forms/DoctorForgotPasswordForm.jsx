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
import { Loader2 } from "lucide-react";
import { doctorForgotPassword } from "@/services/doctorService";
import { NavLink, useNavigate } from "react-router-dom";
import errorMessage from "@/utils/errorCode";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";

const FormSchema = zod.object({
  email: zod.string().trim().email({ message: "Enter email in correct format" }),
});

/**
 * form component for forget password.
 * @returns doctor forgot password form component
 */
export const DoctorForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");

  const navigation = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
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
   * This function used to submit the forgot password api to get the password resetting link in email.
   * @param {*} data-email of doctor
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await doctorForgotPassword(data);
      navigation("/message", {
        state: { message: "Password resetting link has been sent your email" },
      });

      setIsLoading(false);
    } catch (error) {
      setErrorMessageDisplay(
        errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong."
      );
      setIsLoading(false);
    }
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
