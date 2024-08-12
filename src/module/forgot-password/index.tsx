"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {ButtonSubmit} from "@/components/ButtonGlobal";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {emailSchema} from "@/lib/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const formSchema = z.object({
  email: emailSchema,
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.forgotPassword(values.email);
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      router.refresh();
    } catch (error) {
      handleErrorApi({error});
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="size-full flex items-center justify-center p-5 sm:p-20">
      <Card className="rounded-lg w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold border-b border-gray-300 pb-2">
                Tìm tài khoản của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="!mt-0">
              <CardDescription className="text-sm font-medium">
                Vui lòng nhập email để tìm kiếm tài khoản của bạn
              </CardDescription>
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="mt-4 h-[40px]"
                        placeholder="Vui lòng nhập email để tìm kiếm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-3 !mt-0">
              <Button variant="outline" onClick={() => router.push("/login")}>
                Cancel
              </Button>
              <ButtonSubmit
                title="Gửi email"
                loading={loading}
                disabled={loading}
              />
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
