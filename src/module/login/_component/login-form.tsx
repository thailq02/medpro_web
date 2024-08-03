"use client";
import apiAuthRequest, {IGetMeResBody} from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED,
  IStatus,
  REFRESH_TOKEN,
} from "@/apiRequest/common";
import {useAppContext} from "@/app/(home)/AppProvider";
import {ButtonSubmit} from "@/components/ButtonGlobal";
import PasswordInput from "@/components/InputPassword";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {emailSchema, passwordSchema} from "@/lib/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {jwtDecode} from "jwt-decode";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import styles from "../login.module.scss";

const LoginBody = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();
type LoginBodyType = z.TypeOf<typeof LoginBody>;

type LoginFormProps = {
  access_token: string | null;
  refresh_token: string | null;
  expired_at: number | null;
  profile: IGetMeResBody["data"] | null;
};

type NonNullableProps<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

const setLocalStorage = (
  data: Omit<NonNullableProps<LoginFormProps>, "profile">
) => {
  const {access_token, refresh_token, expired_at} = data;
  localStorage.setItem(ACCESS_TOKEN, access_token);
  localStorage.setItem(REFRESH_TOKEN, refresh_token);
  localStorage.setItem(ACCESS_TOKEN_EXPIRED, expired_at?.toString());
};

export default function LoginForm(props: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {toast} = useToast();
  const {setUser} = useAppContext();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  if (
    props.access_token &&
    props.refresh_token &&
    props.expired_at &&
    props.profile
  ) {
    const {access_token, refresh_token, expired_at, profile} = props;
    setUser(profile);
    setLocalStorage({access_token, refresh_token, expired_at});
    router.push("/");
    router.refresh();
  }

  async function onSubmit(values: LoginBodyType) {
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.login(values);
      if (result.status === IStatus.SUCCESS) {
        toast({
          title: "Thành công",
          description: result.payload.message,
          duration: 5000,
        });
        const {access_token, refresh_token} = result.payload.data;
        const decoded = jwtDecode(access_token);
        const expiredAt = decoded.exp ? decoded.exp : 0;
        setLocalStorage({access_token, refresh_token, expired_at: expiredAt});
        const [_, user] = await Promise.all([
          apiAuthRequest.auth({
            access_token,
            refresh_token,
            expiresAt: expiredAt as number,
          }),
          apiAuthRequest.getMe(access_token),
        ]);
        setUser(user.payload.data);
        router.push("/");
        router.refresh();
      } else {
        toast({
          title: "Thất bại",
          description: result.payload.message,
          duration: 5000,
        });
      }
    } catch (error) {
      handleErrorApi({error, setError: form.setError, duration: 4000});
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="w-full max-w-[500px] flex flex-col gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập email"
                    className={styles.input}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Nhập mật khẩu"
                    className={styles.input}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="ml-auto p-0"
            variant={"ghost"}
            type="button"
            onClick={() => router.push("/forgot-password")}
          >
            Quên mật khẩu
          </Button>
          <ButtonSubmit
            title="Đăng nhập"
            loading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </Form>
  );
}
