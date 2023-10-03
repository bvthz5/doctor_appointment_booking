import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import errorMessage from "@/utils/errorCode";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import { getOtpFromEmail } from "@/services/hospitalService";
import { useForm } from "react-hook-form";
import { UserOtpForm } from "./UserOtpForm";
import PropTypes from "prop-types";

/**
 * validation of email
 */
const FormSchema = zod.object({
  email: zod.string().trim().email({ message: "Enter email in correct format" }),
});

/**
 * used to get the email from the user
 * @param {any} used to set the state to true after the successfull verification,
 * setUserDetails state to update the user details
 * @returns email form component
 */
export const EmailForm = ({ setEmailVerified,setUserDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");
  const [otpOptionViewOpen, setOtpOptionViewOpen] = useState(false);

  /**
   * useform of react hook form and its default value
   */
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
   *
   * @param {object} object with email data
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await getOtpFromEmail(data);
      setOtpOptionViewOpen(true);
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
    <div className="flex justify-center">
      <div className="w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-[25vw]  mt-[10vh] sm:mt-[20vh]">
        {!otpOptionViewOpen && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
              <ErrorDisplay message={errorMessageDisplay} />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@examle.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        )}
        {otpOptionViewOpen && (
          <UserOtpForm
            email={form.getValues("email")}
            setEmailVerified={setEmailVerified}
            setUserDetails={setUserDetails}
          />
        )}
      </div>
    </div>
  );
};
EmailForm.propTypes = { setEmailVerified: PropTypes.any,setUserDetails:PropTypes.any };
