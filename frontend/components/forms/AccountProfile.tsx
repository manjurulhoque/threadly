"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";

const AccountProfile = ({user, btnTitle}) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    let userImage = user.image ? `${process.env.BACKEND_BASE_URL}/${user.image}` : "";

    const form = useForm<any>({
        // resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: userImage,
            name: user.name ?? "",
            username: user.username ?? "",
            bio: user.bio ?? "",
        },
    });

    const onSubmit = async (values: any) => {
        setIsSubmitting(true);
        const blob = values.profile_photo;
        const formData = new FormData();
        if (blob && blob instanceof File) formData.append("image", blob);
        formData.append("name", values.name);
        formData.append("username", values.username);
        formData.append("bio", values.bio);

        try {
            const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/users/update-profile`, {
                method: "PUT",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${session?.access}`, // Add the Bearer token here
                },
            });
            const data = await response.json();
            console.log(data);
            // router.back();
        } catch (error: any) {
            throw new Error(`Failed to update user: ${error}`);
        }
        setIsSubmitting(false);
    };

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: File) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            // fileReader.onload = async (event) => {
            //     const imageDataUrl = event.target?.result?.toString() || "";
            //     fieldChange(imageDataUrl);
            // };

            // Pass the file directly
            fieldChange(file);

            fileReader.readAsDataURL(file);
        }
    };

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Form {...form}>
            <form
                className='flex flex-col justify-start gap-4'
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name='profile_photo'
                    render={({field}) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ? (
                                    <Image
                                        src={field.value}
                                        alt='profile_icon'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-contain'
                                    />
                                ) : (
                                    <Image
                                        src='/assets/profile.svg'
                                        alt='profile_icon'
                                        width={24}
                                        height={24}
                                        className='object-contain'
                                    />
                                )}
                            </FormLabel>
                            <FormControl className='flex-1 text-base-semibold dark:text-gray-200'>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Add profile photo'
                                    className='account-form_image-input'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='name'
                    render={({field}) => (
                        <FormItem className='flex w-full flex-col gap-2'>
                            <FormLabel className='text-base-semibold dark:text-light-2'>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='username'
                    render={({field}) => (
                        <FormItem className='flex w-full flex-col gap-2'>
                            <FormLabel className='text-base-semibold dark:text-light-2'>
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='bio'
                    render={({field}) => (
                        <FormItem className='flex w-full flex-col gap-1'>
                            <FormLabel className='text-base-semibold dark:text-light-2'>
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='dark:bg-primary-500'>
                    {isSubmitting ? (
                        <Loader className="animate-spin w-5 h-5 mr-2" />
                    ) : (
                        <span>{btnTitle}</span>
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default AccountProfile;