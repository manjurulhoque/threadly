"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useAddThreadMutation } from "@/store/threads/threadApi";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

interface Props {
}

const PostThread = (Props) => {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const [addThread, {isLoading, isError, error}] = useAddThreadMutation();

    const form = useForm<z.infer<any>>({
        // resolver: zodResolver(ThreadValidation),
        defaultValues: {
            content: "",
        },
    });

    // Ensure the component is only rendered after it's mounted on the client
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Avoid rendering anything during SSR
    }

    const onSubmit = async (values: z.infer<any>) => {
        try {
            await addThread({
                content: values.content,
            }).unwrap();
            toast.success("Thread posted successfully");
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to post thread");
        }
    };

    return (
        <Form {...form}>
            <form
                className='flex flex-col justify-start gap-3'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='content'
                    render={({field}) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 dark:bg-dark-3 dark:text-light-1'>
                                <Textarea rows={5} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='dark:bg-primary-500' disabled={isLoading}>
                    {isLoading ? (
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                    ) : (
                        <span>Post Thread</span>
                    )}
                </Button>
            </form>
        </Form>
    );
}

export default PostThread;