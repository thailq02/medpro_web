"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {ButtonSubmit} from "@/components/ButtonGlobal";
import {CalendarIcon} from "@/components/Icon";
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
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {useToast} from "@/components/ui/use-toast";
import {cn} from "@/lib/utils";
import {RegisterBody, RegisterBodyType} from "@/module/register/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import {format} from "date-fns";
import {vi} from "date-fns/locale";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import {useForm} from "react-hook-form";
import styles from "./register.module.scss";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const {toast} = useToast();
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      password: "",
      date_of_birth: new Date(),
      gender: 0,
      name: "",
    },
  });

  async function onSubmit(_values: RegisterBodyType) {
    const dateOfBirth = new Date(_values.date_of_birth);
    const confirmPassword = _values.password;
    const values = {
      ..._values,
      date_of_birth: dateOfBirth.toISOString(),
      confirm_password: confirmPassword,
    };
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.register(values);
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.toggleContainer}>
          <div className={styles.right}>
            <div className={styles.shape}></div>
          </div>
        </div>
        <div className={clsx(styles.formContainer, styles.signUp)}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <h1 className={styles.title}>Đăng ký</h1>
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
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên"
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
                  name="gender"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(e) =>
                            form.setValue("gender", Number(e))
                          }
                        >
                          <SelectTrigger className={styles.selectTrigger}>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999999999]">
                            <SelectGroup>
                              <SelectItem value="0" className="cursor-pointer">
                                Nam
                              </SelectItem>
                              <SelectItem value="1" className="cursor-pointer">
                                Nữ
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "dd/MM/yyyy")
                              ) : (
                                <span>Chọn ngày sinh</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full p-0 z-[99999999999999]"
                          align="start"
                        >
                          <DayPicker
                            mode="single"
                            captionLayout="dropdown"
                            fromMonth={new Date(1900, 12)}
                            toMonth={new Date()}
                            locale={vi}
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
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
                <ButtonSubmit
                  title="Đăng ký"
                  loading={loading}
                  disabled={loading}
                />
              </div>
              <div className="!mt-14 pb-1">
                <span className="font-bold">Đã có tài khoản?</span>
                <Button
                  variant="outline"
                  className="font-medium ml-3"
                  onClick={() => router.push("/login")}
                >
                  <span>Login</span>
                  <ArrowRightIcon className="size-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
