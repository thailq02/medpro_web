"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {ButtonSubmit} from "@/components/ButtonGlobal";
import PasswordInput from "@/components/InputPassword";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {useToast} from "@/components/ui/use-toast";
import {
  ResetPasswordBody,
  ResetPasswordBodyType,
} from "@/module/reset-password/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: ResetPasswordBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.resetPassword({
        ...values,
        forgot_password_token: token as string,
      });
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      form.reset();
      router.refresh();
      router.push("/login");
    } catch (error) {
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="size-full flex items-center justify-center p-20">
      <Card className="rounded-lg w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold border-b border-gray-300 pb-2">
                Cập nhật mật khẩu mới
              </CardTitle>
            </CardHeader>
            <CardContent className="!mt-0">
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({field}) => (
                  <FormItem className="space-y-1 !mt-3">
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
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
                title="Cập nhật mật khẩu"
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
