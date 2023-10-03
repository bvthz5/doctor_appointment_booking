import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PropTypes from "prop-types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import errorMessage from "@/utils/errorCode";
import { getOtpFromEmail, verifyOtpOfUser } from "@/services/hospitalService";
import { toast } from "../ui/use-toast";

const otpRegex = /(?=.*\d)/;

/**
 * validation of otp
 */
const FormSchema = z.object({
  otp: z
    .string()
    .trim()
    .refine((value) => otpRegex.test(value), "Otp must be number")
    .refine((value) => {
      return value?.length === 6;
    }, "Otp must be 6 Numbers"),
});

/**
 * component for getting the otp and send to server for verification.
 * @param {string} email from the email component
 * @param {*} used to set the state to true after the successfull verification
 * @returns
 */
export const UserOtpForm = ({ email, setEmailVerified, setUserDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState(
    "Otp has been sent to your email address"
  );
  const [successOrNot, setSuccessOrNot] = useState(true);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
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
   * used for submitting the otp and email to verify the email
   * @param {object} object with otp data
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let newOtpAndEmail = {
        email: email,
        otp: data.otp,
      };
      const res = await verifyOtpOfUser(newOtpAndEmail);
      localStorage.accessToken = res?.data?.accessToken;
      setUserDetails(res.data?.userDetails);
      setEmailVerified(true);
      setIsLoading(false);
      toast({
        variant: "success",
        description: "Otp has been successfully verified",
      });
    } catch (error) {
      setSuccessOrNot(false);
      setErrorMessageDisplay(
        errorMessage[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong."
      );
      setIsLoading(false);
    }
  };

  /**
   * function for handling the resenting the otp
   */
  const handleResentOtp = async () => {
    setSuccessOrNot(true);
    form.reset();
    form.clearErrors("otp");
    setErrorMessageDisplay("Otp has been sent again to your email address");
    await getOtpFromEmail({ email: email });
  };
  return (
    <Form {...form}>
      <ErrorDisplay message={errorMessageDisplay} success={successOrNot} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 mt-2">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Otp</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            variant={"link"}
            className="h-min py-0 my-1"
            onClick={handleResentOtp}
            type="button"
          >
            resent otp
          </Button>
        </div>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify
        </Button>
      </form>
    </Form>
  );
};
UserOtpForm.propTypes = {
  email: PropTypes.string,
  setEmailVerified: PropTypes.any,
  setUserDetails: PropTypes.any,
};
