"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddThreadMutation } from "@/store/threads/threadApi";
import { toast, useToast } from "@/components/ui/use-toast";

interface Props {
}

const PostThread = (Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [addThread, {isLoading, error}] = useAddThreadMutation();

    // const { organization } = useOrganization();

    const form = useForm<z.infer<any>>({
        // resolver: zodResolver(ThreadValidation),
        defaultValues: {
            content: "",
        },
    });

    const onSubmit = async (values: z.infer<any>) => {
        toast({
            title: "Hello!",
            description: "This is a custom toast notification.",
        });
        // try {
        //     await addThread({
        //         content: values.content,
        //     }).unwrap();
        //     router.push("/");
        //     useToast()
        // } catch (error) {
        //     console.error(error);
        // }
    };

    return (
        <Form {...form}>
            <form
                className='mt-10 flex flex-col justify-start gap-10'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='thread'
                    render={({field}) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea rows={15} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500'>
                    Post Thread
                </Button>
            </form>
        </Form>
    );
}

export default PostThread;