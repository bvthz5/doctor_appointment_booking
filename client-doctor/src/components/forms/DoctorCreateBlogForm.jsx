import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as zod from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Edit, Loader2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import {
  doctorBloggetById,
  doctorCreateBlog,
  doctorEditBlog,
} from "@/services/blogService";
import { toast } from "../ui/use-toast";
import { ErrorDisplay } from "../errorDisplay/ErrorDisplay";
import errorMessageCode from "@/utils/errorCode";
import PropTypes from "prop-types";

const FormSchema = zod.object({
  title: zod
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(50, { message: "Title must contain at most 50 character(s)" }),
  content: zod
    .string()
    .trim()
    .min(1, { message: "Content is required" })
    .max(1000, {
      message: "Content must contain at most 1000 character(s)",
    }),
});

/**
 * This form component is used to create and update the blog
 * @param {*} edit to know create or edit blog ,blogId of blog and getBlogList funcition to get the bloglist in the main page
 * @returns create or blog
 */
export const DoctorCreateBlogForm = ({ edit = false, blogId, getBlogList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [errorMessageDisplay, setErrorMessageDisplay] = useState("");
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  /**
   * if edit is true and model is open only then that particular blog will be fetched
   */
  useEffect(() => {
    edit && isModalOpen && getBlogById(blogId);
  }, [isModalOpen]);

  /** Function that triggers when submiting create blog form. In this form createBlog function is called by passing data from form */
  const onSubmit = (data) => {
    createBlog(data);
  };
  /** Function that conation codes to executed when closing the create blog modal*/
  const onCloseModal = () => {
    form.reset();
    setErrorMessageDisplay("");
    SetIsModalOpen(false);
  };

  /** Function to create blog by passing data from form */
  const createBlog = async (data) => {
    try {
      setIsLoading(true);
      if (edit) {
        await doctorEditBlog(blogId, data);
      } else {
        await doctorCreateBlog(data);
      }
      getBlogList(1);
      setIsLoading(false);
      SetIsModalOpen(false);
      toast({
        variant: "success",
        description: edit
          ? "Blog updated successfully"
          : "Blog created successfully",
      });
      form.reset();
      setErrorMessageDisplay("");
    } catch (error) {
      setErrorMessageDisplay(
        errorMessageCode[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong."
      );
      setIsLoading(false);
    }
  };

  /** Function to get details of a blog by passing id */
  const getBlogById = async (id) => {
    try {
      const response = await doctorBloggetById(id);
      form.setValue("title", response?.data?.title);
      form.setValue("content", response?.data?.content);
    } catch (error) {
      setErrorMessageDisplay(
        errorMessageCode[error?.response?.data?.errorCode] ||
          "Uh oh! Something went wrong."
      );
    }
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          SetIsModalOpen(true);
        }}
      >
        {edit ? (
          <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </div>
        ) : (
          <Button className="w-[125px] text-[#328090] bg-transparent border border-[#328090] hover:bg-[#328090] hover:text-white">
            Create Blog
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogPrimitive.Close className="absolute right-4 top-4  opacity-70 transition-opacity hover:opacity-100 focus:outline-none  disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" onClick={onCloseModal} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <DialogHeader>
          <DialogTitle className="text-3xl">
            {edit ? "Edit Blog" : "Create Blog"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-1"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <div className="flex justify-end">
                        <Textarea
                          multilne
                          className="resize-none h-64"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ErrorDisplay message={errorMessageDisplay} />

              <Button disabled={isLoading} type="submit" className="w-full  ">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

DoctorCreateBlogForm.propTypes = {
  edit: PropTypes.bool,
  blogId: PropTypes.any,
  getBlogList: PropTypes.any,
};
