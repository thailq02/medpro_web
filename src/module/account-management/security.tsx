"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {VerifyStatus} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {ButtonSubmit} from "@/components/ButtonGlobal";
import PasswordInput from "@/components/InputPassword";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useToast} from "@/components/ui/use-toast";
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from "@/module/account-management/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import {useForm} from "react-hook-form";

export default function SecurityForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useContext(AppContext);
  const {toast} = useToast();
  const router = useRouter();

  const disabled =
    user?.verify === VerifyStatus.BANNED ||
    user?.verify === VerifyStatus.VERIFIED;

  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  async function onSubmit(values: ChangePasswordBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.changePassword(values);
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      form.reset();
      router.refresh();
    } catch (error) {
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerifyEmail() {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.resendVerifyEmail();
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
    } catch (error) {
      handleErrorApi({error, duration: 3000});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="border-b border-gray-300 pb-4">Bảo mật</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-between">
          <Label>Mật khẩu</Label>
          <Label>••••••••••</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-xs">
                Cập nhật
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[999999999999]" align="end">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 mt-3 text-xs"
                >
                  <FormField
                    control={form.control}
                    name="old_password"
                    render={({field}) => (
                      <FormItem className="space-y-1">
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({field}) => (
                      <FormItem className="space-y-1 !mt-3">
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirm_new_password"
                    render={({field}) => (
                      <FormItem className="space-y-1 !mt-3">
                        <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ButtonSubmit
                    disabled={loading}
                    loading={loading}
                    className="w-full"
                    title="Đổi mật khẩu"
                  />
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-between">
          <Label>Trạng thái</Label>
          <div className="flex items-center justify-center">
            {user?.verify === VerifyStatus.VERIFIED ? (
              <>
                <div className="size-4 rounded-full bg-green-500"></div>
                <span className="inline-block text-xs ml-1 font-bold">
                  Đã xác thực
                </span>
              </>
            ) : user?.verify === VerifyStatus.UNVERIFIED ? (
              <>
                <div className="size-4 rounded-full bg-yellow-500"></div>
                <span className="inline-block text-xs ml-1 font-bold">
                  Chưa xác thực
                </span>
              </>
            ) : (
              <>
                <div className="size-4 rounded-full bg-red-500"></div>
                <span className="inline-block text-xs ml-1 font-bold">
                  Tài khoản đã bị khoá
                </span>
              </>
            )}
          </div>
          <ButtonSubmit
            variant="outline"
            disabled={
              (user?.verify === VerifyStatus.UNVERIFIED && loading) || disabled
            }
            className="text-xs"
            onClick={handleResendVerifyEmail}
            loading={loading}
            title="Xác thực tài khoản"
          />
        </div>
      </CardContent>
    </Card>
  );
}
