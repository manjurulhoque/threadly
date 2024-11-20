"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAddThreadMutation } from "@/store/threads/threadApi";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { Mention, MentionsInput } from "react-mentions";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

// Define types for mentions
interface Mention {
    id: string | number;
    display: string;
}

// Define form schema
const threadSchema = z.object({
    content: z.string().min(1, "Thread content is required"),
});

type ThreadFormValues = z.infer<typeof threadSchema>;

// Styles for MentionsInput
const mentionStyle = {
    control: {
        fontSize: 16,
        fontWeight: "normal",
        minHeight: 150,
        overflow: "auto",
    },
    highlighter: {
        overflow: "hidden",
    },
    input: {
        margin: 0,
    },
    "&multiLine": {
        control: {
            minHeight: 150,
        },
        highlighter: {
            padding: 1,
            border: '1px solid transparent',
        },
        input: {
            padding: 1,
        },
    },
    suggestions: {
        list: {
            backgroundColor: 'black',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 14,
        },
        item: {
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#4e4949',
            },
        },
    },
};

const PostThread = () => {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const [addThread, { isLoading }] = useAddThreadMutation();
    const [mentions, setMentions] = useState<Mention[]>([]);
    const { data: session } = useSession();

    const form = useForm<ThreadFormValues>({
        defaultValues: {
            content: "",
        },
        resolver: zodResolver(threadSchema),
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const fetchSuggestions = async (query: string, callback: (suggestions: Mention[]) => void) => {
        if (!query) return;
        try {
            const response = await fetch(`${process.env.BACKEND_BASE_URL}/api/user-suggestions?query=${query}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access}`,
                },
                method: 'GET',
            });
            const res = await response.json();
            const suggestions = res?.users?.map((user: { id: string | number; username: string }) => ({
                id: user.id,
                display: user.username,
            }));
            callback(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const onSubmit = async (values: ThreadFormValues) => {
        try {
            await addThread({
                content: values.content,
                mentions: mentions.map((mention) => mention.id),
            });
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
                className="flex flex-col justify-start gap-3 mt-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormControl className="no-focus border border-dark-4 dark:bg-dark-3 dark:text-light-1">
                                <MentionsInput
                                    {...field}
                                    style={mentionStyle}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    placeholder="Type your thread content and mention users with @"
                                    a11ySuggestionsListLabel={"Suggested mentions"}
                                >
                                    <Mention
                                        trigger="@"
                                        data={fetchSuggestions}
                                        style={{ backgroundColor: "rgb(135 126 255)" }}
                                        onAdd={(id: string | number, display: string) => {
                                            setMentions([...mentions, { id, display }]);
                                        }}
                                        renderSuggestion={(
                                            suggestion,
                                            search,
                                            highlightedDisplay,
                                            index,
                                            focused
                                        ) => (
                                            <div className={`user ${focused ? 'focused' : ''}`}>
                                                {highlightedDisplay}
                                            </div>
                                        )}
                                    />
                                </MentionsInput>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" className="dark:bg-primary-500 dark:hover:bg-primary-400" disabled={isLoading}>
                        {isLoading ? (
                            <Loader className="animate-spin w-5 h-5 mr-2"/>
                        ) : (
                            <span className="dark:text-light-2">Post Thread</span>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default PostThread;
