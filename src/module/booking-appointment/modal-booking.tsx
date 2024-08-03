"use client";
import apiAppointment from "@/apiRequest/ApiAppointment";
import {IDoctorBody} from "@/apiRequest/ApiDoctor";
import {IServiceBody} from "@/apiRequest/ApiService";
import {handleErrorApi} from "@/apiRequest/ErrorMessage/errors";
import {BOOKING, PARAMS} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {ButtonSubmit} from "@/components/ButtonGlobal";
import {CalendarIcon} from "@/components/Icon";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/components/ui/use-toast";
import {cn, renderPosition} from "@/lib/utils";
import {
  BookingBody,
  BookingBodyType,
} from "@/module/booking-appointment/form-config";
import {zodResolver} from "@hookform/resolvers/zod";
import {format} from "date-fns";
import {vi} from "date-fns/locale";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useContext, useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/dist/style.css";
import {useForm} from "react-hook-form";

interface IModalBookingAppointmentProps {
  isOpen: boolean;
  handleOke?: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  doctor?: IDoctorBody;
  timeAppointment?: string;
  dateAppointment?: string;
  service?: IServiceBody;
}

export default function ModalBookingAppointment({
  isOpen,
  setIsOpen,
  handleOke,
  doctor,
  timeAppointment,
  dateAppointment,
  service,
}: IModalBookingAppointmentProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useContext(AppContext);
  const searchParams = useSearchParams();
  const {toast} = useToast();
  const router = useRouter();
  const feature = searchParams.get(PARAMS.FEATURE);

  const form = useForm<BookingBodyType>({
    resolver: zodResolver(BookingBody),
    defaultValues: {
      fullname: user?.name,
      phone_number: user?.phone_number,
      address: user?.address,
      reason: "",
      date_of_birth: new Date(user?.date_of_birth || ""),
      gender: user?.gender,
      email: user?.email,
    },
  });

  const price =
    feature === BOOKING.DATE ||
    feature === BOOKING.VACCINE ||
    feature === BOOKING.PACKAGE
      ? service?.price
      : doctor?.price;

  async function onSubmit(_values: BookingBodyType) {
    const dateOfBirth = new Date(_values.date_of_birth).toISOString();
    const values = {
      ..._values,
      date_of_birth: dateOfBirth,
      time: timeAppointment,
      date: dateAppointment,
      price,
      doctor_id: doctor?.doctor_id,
      patient_id: user?._id,
      service_id: service?._id,
      isPayment: false,
      status: false,
    };
    if (loading) return;
    setLoading(true);
    try {
      const result = await apiAppointment.create(values);
      toast({
        title: "Thành công",
        description: result.payload.message,
        duration: 5000,
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      handleErrorApi({error, setError: form.setError, duration: 3000});
    } finally {
      form.setValue("reason", "");
      setLoading(false);
    }
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="z-[9999] !max-w-[90vw] !max-h-[80vh] p-3 overflow-x-hidden overflow-y-scroll scrollbar-global booking-576:p-6 booking-840:!max-w-[65vw] booking-840:!max-h-[70vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Thông tin về đặt lịch khám bệnh
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex flex-col items-center gap-5 !mt-4 booking-576:flex-row booking-576:items-start booking-576:mt-8">
              <div className="size-[90px]">
                <Image
                  src={doctor?.avatar || "/img/avatar/avatar.jpg"}
                  alt="doctor"
                  width={90}
                  height={90}
                  className="rounded-full size-full"
                />
              </div>
              <div className="flex flex-col items-center gap-1 font-semibold booking-576:items-start">
                <span>
                  {renderPosition(doctor?.position as number)}{" "}
                  {doctor?.name || "Bác sĩ thuộc bệnh viện"}
                </span>
                <span>
                  {timeAppointment} - {dateAppointment}
                </span>
                <span>
                  Giá tiền: {price?.toLocaleString("vi-Vn")}đ - {service?.name}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 booking-576:grid-cols-2">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
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
                  name="fullname"
                  render={({field}) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="font-semibold">Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({field}) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="font-semibold">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({field}) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="font-semibold">Ngày sinh</FormLabel>
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
                    <FormItem className="space-y-0">
                      <FormLabel className="font-semibold">Giới tính</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(e) =>
                            form.setValue("gender", Number(e))
                          }
                        >
                          <SelectTrigger>
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
                  name="address"
                  render={({field}) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="font-semibold">Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="reason"
              render={({field}) => (
                <FormItem className="!mt-2 space-y-0">
                  <FormLabel className="font-semibold">
                    Lý do khám bệnh
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập lý do khám bệnh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right flex items-center gap-2 justify-end">
              <Button onClick={() => setIsOpen(false)} variant="outline">
                Huỷ
              </Button>
              <ButtonSubmit
                title="Đặt lịch khám bệnh"
                loading={loading}
                disabled={loading}
                onClick={handleOke}
              />
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
