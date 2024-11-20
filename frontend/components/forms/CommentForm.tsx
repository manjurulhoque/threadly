"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, } from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { useComments } from "@/context/CommentsContext";

interface Props {
    threadId: number;
    currentUserImg: string;
}

const CommentForm = ({threadId, currentUserImg}: Props) => {
    const { refreshComments } = useComments();
    const form = useForm<z.infer<any>>({
        // resolver: zodResolver(CommentValidation),
        defaultValues: {
            content: "",
        },
    });

    const onSubmit = async (values: z.infer<any>) => {
        await addCommentToThread(threadId, values.content);

        form.reset();
        refreshComments();
    };

    const userImage = currentUserImg ? `${process.env.BACKEND_BASE_URL}/${currentUserImg}` : "";

    return (
        <Form {...form}>
            <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='content'
                    render={({field}) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={userImage}
                                    alt='current_user'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border border-gray-600 bg-transparent'>
                                <Input
                                    type='text'
                                    {...field}
                                    placeholder='Comment...'
                                    className='no-focus dark:text-light-1 outline-none'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    );
}

export default CommentForm;