"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import ApiUploadImage from "@/apiRequest/ApiUploadImage";
import {VerifyStatus} from "@/apiRequest/common";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {AppContext} from "@/app/(home)/AppProvider";
import {AvatarUpload} from "@/components/AvatarUpload";
import {ButtonSubmit} from "@/components/ButtonGlobal";
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
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/components/ui/use-toast";
import {cn} from "@/lib/utils";
import {
  AccountBody,
  AccountBodyType,
} from "@/module/account-management/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {CalendarIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";
import {vi} from "date-fns/locale";
import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import {useForm} from "react-hook-form";
import styles from "./Account.module.scss";

export default function UpdateMeForm() {
  const [loading, setLoading] = useState<boolean>(false);

  const {user, setUser} = useContext(AppContext);
  const router = useRouter();
  const {toast} = useToast();

  const disabled =
    user?.verify === VerifyStatus.BANNED ||
    user?.verify === VerifyStatus.UNVERIFIED;

  const form = useForm<AccountBodyType>({
    resolver: zodResolver(AccountBody),
    defaultValues: {
      email: user?.email,
      avatar: user?.avatar,
      username: user?.username,
      date_of_birth: new Date(user?.date_of_birth ?? ""),
      gender: user?.gender,
      name: user?.name,
      phone_number: user?.phone_number,
      address: user?.address,
    },
  });

  async function onSubmit(_values: AccountBodyType) {
    const dateOfBirth = _values.date_of_birth.toISOString();
    const formData = new FormData();
    let values = {
      ..._values,
      date_of_birth: dateOfBirth,
    };
    if (values?.avatar && typeof values.avatar !== "string") {
      formData.append("image", values.avatar);
      const imageUrl = await ApiUploadImage.uploadImage(formData);
      values = {
        ...values,
        avatar: imageUrl.payload.data[0].url as string,
      };
    }
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAuthRequest.updateMe(
        values as AccountBodyType & {avatar: string; date_of_birth: string}
      );
      setUser(result.payload.data);
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 3000,
      });
      router.refresh();
    } catch (error) {
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className="h-full overflow-y-scroll scrollbar-global">
      <CardHeader className="account-860:sticky account-860:top-0 account-860:z-10 account-860:bg-white">
        <CardTitle className="border-b border-gray-300 pb-4">
          Thông tin cá nhân
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-2 ${styles.cardContent} no-scrollbar`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="avatar"
              render={({field}) => (
                <FormItem className="flex items-center justify-center">
                  <FormControl>
                    <AvatarUpload
                      value={field.value}
                      onChange={(v) => form.setValue("avatar", v as File)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className={styles.updateMe}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập email"
                          {...field}
                          disabled
                          readOnly
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
                        <Input placeholder="Nhập name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
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
                            defaultMonth={new Date(field.value)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                          value={field.value.toString()}
                          onValueChange={(e) =>
                            form.setValue("gender", Number(e))
                          }
                        >
                          <SelectTrigger className={styles.selectTrigger}>
                            <SelectValue placeholder="Giới tính" />
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
                  name="phone_number"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập địa chỉ"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ButtonSubmit
              title={`${
                disabled ? "Tài khoản chưa xác thực" : "Cập nhật thông tin"
              }`}
              loading={loading}
              disabled={loading || disabled}
              className={styles.btn_submit}
              classNameLoading="mr-4 size-5"
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
