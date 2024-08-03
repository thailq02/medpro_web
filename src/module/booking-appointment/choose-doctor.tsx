/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import apiDoctor, {IDoctorBody} from "@/apiRequest/ApiDoctor";
import apiService from "@/apiRequest/ApiService";
import {ISpecialtyBody} from "@/apiRequest/ApiSpecialty";
import {BOOKING, PARAMS, PositionType, STEP_NAME} from "@/apiRequest/common";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import useDebounce from "@/hooks/useDebounce";
import {getStepNameAndServiceId, renderPosition} from "@/lib/utils";
import {CalendarIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import styles from "./BookingAppointment.module.scss";

export type DoctorFilter = {
  name?: string;
  gender?: string;
  position?: string;
  specialty_id?: string;
};
interface IChooseDoctorProps {
  feature: string;
  hospitalId: string;
  specialtyId: string;
  isLoading: boolean;
  doctors: IDoctorBody[];
  specialty: ISpecialtyBody[];
  onFilterDoctor: (
    value: DoctorFilter | ((prev: DoctorFilter) => DoctorFilter)
  ) => void;
}

const useDoctorData = (
  hospitalId: string,
  enabled: boolean,
  options?: DoctorFilter
) => {
  return useQuery({
    queryKey: [
      QUERY_KEY.GET_DOCTOR_BY_HOSPITAL_ID,
      {hospital_id: hospitalId, params: {...options, search: options?.name}},
    ],
    queryFn: () =>
      apiDoctor.getListDoctorByHospitalId({
        hospital_id: hospitalId,
        params: {...options, search: options?.name},
      }),
    enabled: enabled,
  });
};

const useServiceData = (hospitalId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.GET_SERVICE_BY_HOSPITAL_ID, hospitalId],
    queryFn: () => apiService.getFullServiceByHospitalId(hospitalId),
    enabled: !!hospitalId,
  });
};

export default function ChooseDoctor({
  feature,
  hospitalId,
  specialtyId,
  isLoading,
  doctors,
  specialty,
  onFilterDoctor,
}: IChooseDoctorProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [searchDoctor, setSearchDoctor] = useState<string>("");
  const [filterDoctor, setFilterDoctor] = useState<DoctorFilter>({
    name: "",
    gender: "",
    position: "",
    specialty_id: "",
  });
  const filterDebounce = useDebounce(searchDoctor, 500);

  const isDoctorStep =
    searchParams.get(PARAMS.STEP_NAME) === STEP_NAME.DOCTOR &&
    feature === BOOKING.DOCTOR;

  const {data, isLoading: isLoadingDoctor} = useDoctorData(
    hospitalId,
    isDoctorStep,
    {...filterDoctor}
  );

  const {data: services} = useServiceData(hospitalId);

  const doctorList = isDoctorStep ? data?.payload.data : doctors;
  const memoizedOnFilterDoctor = useCallback(onFilterDoctor, []);

  useEffect(() => {
    if (!isDoctorStep) {
      memoizedOnFilterDoctor((prev) => ({
        ...prev,
        name: filterDebounce,
      }));
    } else {
      setFilterDoctor((prev) => ({
        ...prev,
        name: filterDebounce,
      }));
    }
  }, [filterDebounce, memoizedOnFilterDoctor]);

  const handleDoctorClick = (doctor: IDoctorBody) => {
    const params = new URLSearchParams();
    const specialty_id =
      feature === BOOKING.DATE ? specialtyId : doctor.specialty?._id;
    const {stepName, serviceId} = getStepNameAndServiceId({
      specialty_id: specialty_id as string,
      services: services?.payload?.data || [],
    });
    params.append(PARAMS.FEATURE, feature);
    params.append(PARAMS.HOSPITAL_ID, hospitalId);
    params.append(PARAMS.SPECIALTY_ID, specialty_id ?? "");
    params.append(PARAMS.DOCTOR_ID, doctor.doctor_id ?? "");
    params.append(PARAMS.STEP_NAME, stepName);
    if (!stepName.includes(STEP_NAME.SERVICE)) {
      params.append(PARAMS.SERVICE_ID, serviceId ?? "");
    }
    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  return (
    <div className={styles.rightBody}>
      <div className={styles.search}>
        <Input
          placeholder="Tìm nhanh bác sĩ"
          onChange={(e) => setSearchDoctor(e.target.value)}
        />
        <div className={styles.listFilter}>
          <Select
            onValueChange={(e) => {
              if (!isDoctorStep) {
                onFilterDoctor((prev) => ({
                  ...prev,
                  gender: e,
                }));
              } else {
                setFilterDoctor((prev) => ({
                  ...prev,
                  gender: e,
                }));
              }
            }}
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="Giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="null">Giới tính</SelectItem>
                <SelectItem value="0">Nam</SelectItem>
                <SelectItem value="1">Nữ</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(e) => {
              if (!isDoctorStep) {
                onFilterDoctor((prev) => ({
                  ...prev,
                  position: e,
                }));
              } else {
                setFilterDoctor((prev) => ({
                  ...prev,
                  position: e,
                }));
              }
            }}
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="Hàm học / học vị" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="null">Hàm học / học vị</SelectItem>
                <SelectItem value={PositionType.MASTER.toString()}>
                  Thạc sĩ
                </SelectItem>
                <SelectItem value={PositionType.DOCTOR.toString()}>
                  Tiến sĩ
                </SelectItem>
                <SelectItem value={PositionType.ASSOCIATE_PROFESSOR.toString()}>
                  Phó giáo sư
                </SelectItem>
                <SelectItem value={PositionType.PROFESSOR.toString()}>
                  Giáo sư
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {isDoctorStep && (
            <Select
              onValueChange={(e) =>
                setFilterDoctor((prev) => ({...prev, specialty_id: e}))
              }
            >
              <SelectTrigger className={styles.selectTrigger}>
                <SelectValue placeholder="Chuyên khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="null">Chuyên khoa</SelectItem>
                  {specialty?.map((s) => (
                    <SelectItem key={s._id} value={s._id ?? ""}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {isLoading || isLoadingDoctor ? (
        <>
          <Skeleton className="w-full h-32 mt-1" />
          <Skeleton className="w-full h-32 mt-1" />
          <Skeleton className="w-full h-32 mt-1" />
        </>
      ) : (
        <ul className={styles.listDoctor}>
          {!!doctorList?.length ? (
            doctorList.map((v) => (
              <li key={v._id} className={styles.cardDoctor}>
                <div role="button" onClick={() => handleDoctorClick(v)}>
                  <div className={clsx(styles.infoLine, styles.highlight)}>
                    <DoctorIcon className="size-4" />
                    {renderPosition(v?.position as number) + " " + v.name}
                  </div>
                  <div className={styles.infoLine}>
                    <GenderIcon className="size-4" />
                    Giới tính: {v.gender === 0 ? "Nam" : "Nữ"}
                  </div>
                  <div className={styles.infoLine}>
                    <StethoscopeIcon className="size-4" />
                    Chuyên khoa: {v.specialty?.name}
                  </div>
                  <div className={styles.infoLine}>
                    <CalendarIcon className="size-4" />
                    Lịch khám: {v.session}
                  </div>
                  <div className={styles.infoLine}>
                    <DollarIcon className="size-4" />
                    Giá: {v.price?.toLocaleString("vi-VN")}đ
                  </div>
                </div>
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
