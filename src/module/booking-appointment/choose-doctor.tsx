"use client";
import {IDoctorBody} from "@/apiRequest/ApiDoctor";
import apiService from "@/apiRequest/ApiService";
import {PositionType} from "@/apiRequest/common";
import {
  DoctorIcon,
  DollarIcon,
  GenderIcon,
  StethoscopeIcon,
} from "@/components/Icon";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import useDebounce from "@/hooks/useDebounce";
import {CalendarIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import {useEffect, useState} from "react";
import styles from "./BookingAppointment.module.scss";

interface IChooseDoctorProps {
  feature: string;
  hospitalId: string;
  specialtyId: string;
  isLoading: boolean;
  doctors: IDoctorBody[];
  onSearchDoctor: (search: string) => void;
}

/**
 Mỗi 1 bệnh viện chỉ có 1 dịch vụ duy nhất là không thuộc chuyên khoa nào => Nếu 1 bệnh viện mà có 2 dịch vụ không thuộc chuyên khoa nào tức specialty === null thì sẽ lỗi
 */

export default function ChooseDoctor({
  feature,
  hospitalId,
  specialtyId,
  isLoading,
  doctors,
  onSearchDoctor,
}: IChooseDoctorProps) {
  const [searchDoctor, setSearchDoctor] = useState<string>("");
  const filterDebounce = useDebounce(searchDoctor, 500);

  useEffect(() => {
    onSearchDoctor(filterDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDebounce]);

  const {data: services} = useQuery({
    queryKey: [QUERY_KEY.GET_SERVICE_BY_HOSPITAL_ID, hospitalId],
    queryFn: () => apiService.getFullServiceByHospitalId(hospitalId),
    enabled: !!hospitalId,
  });

  const result = services?.payload?.data?.find((v) => {
    return v.specialty?._id === specialtyId;
  });

  const stepName = result
    ? result?.specialty === null
      ? "date"
      : "service"
    : "date";
  const serviceId = result
    ? ""
    : services?.payload?.data?.find((v) => v.specialty === null)?._id;

  const genderPosition = (position: number): string => {
    if (position === PositionType.ASSOCIATE_PROFESSOR) return "Phó giáo sư";
    if (position === PositionType.DOCTOR) return "Tiến sĩ";
    if (position === PositionType.PROFESSOR) return "Giáo sư";
    if (position === PositionType.MASTER) return "Thạc sĩ";
    return "";
  };

  return (
    <div className={styles.rightBody}>
      <div className={styles.search}>
        <Input
          placeholder="Tìm nhanh bác sĩ"
          onChange={(e) => setSearchDoctor(e.target.value)}
        />
        <div className={styles.listFilter}>
          <Select>
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="Chuyên khoa" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Chuyên khoa</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <>
          <Skeleton className="w-full h-32 mt-1" />
          <Skeleton className="w-full h-32 mt-1" />
          <Skeleton className="w-full h-32 mt-1" />
        </>
      ) : (
        <ul className={styles.listDoctor}>
          {!!doctors.length ? (
            doctors.map((v) => (
              <li key={v._id} className={styles.cardDoctor}>
                <Link
                  href={{
                    pathname: "/chon-lich-kham",
                    query: {
                      feature,
                      hospitalId,
                      specialtyId,
                      stepName,
                      doctorId: v.doctor_id,
                      serviceId,
                    },
                  }}
                >
                  <div className={clsx(styles.infoLine, styles.highlight)}>
                    <DoctorIcon className="w-4 h-4" />
                    {genderPosition(v?.position as number) + " " + v.name}
                  </div>
                  <div className={styles.infoLine}>
                    <GenderIcon className="w-4 h-4" />
                    Giới tính: {v.gender === 0 ? "Nam" : "Nữ"}
                  </div>
                  <div className={styles.infoLine}>
                    <StethoscopeIcon className="w-4 h-4" />
                    Chuyên khoa: {v.specialty?.name}
                  </div>
                  <div className={styles.infoLine}>
                    <CalendarIcon className="w-4 h-4" />
                    Lịch khám: {v.session}
                  </div>
                  <div className={styles.infoLine}>
                    <DollarIcon className="w-4 h-4" />
                    Giá: {v.price?.toLocaleString("vi-VN")}đ
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-center p-10 text-xl text-textSecondary font-bold">
              Không tìm thấy bác sĩ
            </p>
          )}
        </ul>
      )}
    </div>
  );
}
