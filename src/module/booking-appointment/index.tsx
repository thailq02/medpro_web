"use client";
import apiDoctor from "@/apiRequest/ApiDoctor";
import apiHospital from "@/apiRequest/ApiHospital";
import apiService, {IServiceBody} from "@/apiRequest/ApiService";
import apiSpecialty from "@/apiRequest/ApiSpecialty";
import {PARAMS, STEP_NAME} from "@/apiRequest/common";
import BreadcrumbGlobal from "@/components/BreadcrumbGlobal";
import {
  HandHoldingMedicalIcon,
  HospitalIcon,
  StethoscopeIcon,
  SuitcaseMedicalIcon,
} from "@/components/Icon";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {DoctorFilter} from "@/module/booking-appointment/choose-doctor";
import {CalendarIcon, ResetIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import {useRouter, useSearchParams} from "next/navigation";
import {useCallback, useState} from "react";
import styles from "./BookingAppointment.module.scss";
const ChooseDate = dynamic(
  () => import("@/module/booking-appointment/choose-date"),
  {ssr: false}
);
const ChooseDoctor = dynamic(
  () => import("@/module/booking-appointment/choose-doctor"),
  {ssr: false}
);
const ChooseService = dynamic(
  () => import("@/module/booking-appointment/choose-service"),
  {ssr: false}
);
const ChooseSubject = dynamic(
  () => import("@/module/booking-appointment/choose-subject"),
  {ssr: false}
);

export default function BookingAppointment() {
  const [dateSelected, setDateSelected] = useState<string>("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("");
  const [filterDoctor, setFilterDoctor] = useState<DoctorFilter>({
    name: "",
    gender: "",
    position: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const feature = searchParams.get(PARAMS.FEATURE);
  const hospitalId = searchParams.get(PARAMS.HOSPITAL_ID);
  const stepName = searchParams.get(PARAMS.STEP_NAME);
  const specialtyId = searchParams.get(PARAMS.SPECIALTY_ID);
  const doctorId = searchParams.get(PARAMS.DOCTOR_ID);
  const serviceId = searchParams.get(PARAMS.SERVICE_ID);

  const {data: hospital, isLoading: isLoadingHospital} = useQuery({
    queryKey: [QUERY_KEY.GET_HOSPITAL_BY_ID, hospitalId],
    queryFn: () => apiHospital.getHospitalById(hospitalId ?? ""),
    enabled: !!hospitalId,
  });

  const {data: specialty, isLoading: isLoadingSpecialty} = useQuery({
    queryKey: [
      QUERY_KEY.GET_SPECIALTY_BY_HOSPITAL_ID,
      {hospitalId: hospitalId, params: {search: filterSpecialty}},
    ],
    queryFn: () =>
      apiSpecialty.getListSpecialtyByHospitalId({
        hospitalId: hospitalId ?? "",
        params: {search: filterSpecialty},
      }),
    enabled: !!hospitalId,
  });

  const {data: doctor, isLoading: isLoadingDoctor} = useQuery({
    queryKey: [
      QUERY_KEY.GET_DOCTOR_BY_SPECIALTY_ID,
      {
        hospital_id: hospitalId,
        specialty_id: specialtyId,
        search: filterDoctor.name,
        gender: filterDoctor.gender,
        position: filterDoctor.position,
      },
    ],
    queryFn: () =>
      apiDoctor.getListDoctorBySpecialtyId({
        hospital_id: hospitalId ?? "",
        specialty_id: specialtyId ?? "",
        search: filterDoctor.name,
        gender: filterDoctor.gender,
        position: filterDoctor.position,
      }),
    enabled: !!hospitalId && !!specialtyId,
  });

  const {data: service} = useQuery({
    queryKey: [QUERY_KEY.GET_SERVICE_BY_ID, serviceId],
    queryFn: () => apiService.getServiceById(serviceId ?? ""),
    enabled: !!serviceId,
  });

  const generateBookingName = () => {
    switch (stepName) {
      case STEP_NAME.SUBJECT:
        return "Chọn chuyên khoa";
      case STEP_NAME.DOCTOR:
        return "Chọn bác sĩ";
      case STEP_NAME.SERVICE:
        return "Chọn dịch vụ";
      case STEP_NAME.DATE:
      case STEP_NAME.TIME:
        return "Chọn ngày tư vấn";
      default:
        return "";
    }
  };
  const generateBookingTitle = () => {
    switch (stepName) {
      case STEP_NAME.SUBJECT:
        return "Vui lòng chọn chuyên khoa";
      case STEP_NAME.DOCTOR:
        return "Vui lòng chọn bác sĩ";
      case STEP_NAME.SERVICE:
        return "Vui lòng chọn dịch vụ";
      case STEP_NAME.DATE:
      case STEP_NAME.TIME:
        return "Vui lòng chọn ngày tư vấn";
      default:
        return "";
    }
  };

  const renderRightContent = useCallback(() => {
    switch (stepName) {
      case STEP_NAME.SUBJECT:
        return (
          <ChooseSubject
            feature={feature ?? ""}
            hospitalId={hospitalId ?? ""}
            stepName={stepName}
            specialty={specialty?.payload?.data ?? []}
            isLoading={isLoadingSpecialty}
            onSearchSpecialty={(value) => setFilterSpecialty(value)}
          />
        );
      case STEP_NAME.DOCTOR:
        return (
          <ChooseDoctor
            feature={feature ?? ""}
            hospitalId={hospitalId ?? ""}
            specialtyId={specialtyId ?? ""}
            isLoading={isLoadingDoctor}
            doctors={doctor?.payload?.data ?? []}
            specialty={specialty?.payload?.data ?? []}
            onFilterDoctor={(value) => setFilterDoctor(value)}
          />
        );
      case STEP_NAME.DATE:
      case STEP_NAME.TIME:
        return (
          <ChooseDate
            onChooseDate={(date) => setDateSelected(date)}
            doctors={doctor?.payload?.data ?? []}
            services={(service?.payload?.data as IServiceBody) ?? []}
          />
        );
      case STEP_NAME.SERVICE:
        return (
          <ChooseService
            feature={feature ?? ""}
            hospitalId={hospitalId ?? ""}
            specialtyId={specialtyId ?? ""}
            doctorId={doctorId ?? ""}
            hospitalName={hospital?.payload?.data?.name ?? ""}
          />
        );
      default:
        return null;
    }
  }, [
    stepName,
    feature,
    hospitalId,
    specialty?.payload?.data,
    isLoadingSpecialty,
    specialtyId,
    isLoadingDoctor,
    doctor?.payload?.data,
    service?.payload?.data,
    doctorId,
    hospital?.payload?.data?.name,
  ]);

  const breadcrumb = [
    {label: "Trang chủ", href: "/"},
    {label: hospital?.payload?.data?.name || ""},
    {label: generateBookingName() as string, isActive: true},
  ];
  return (
    <div className="bg-textGrayE8">
      <BreadcrumbGlobal items={breadcrumb} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className="booking-appointment_left">
            <div className={styles.leftContent}>
              <div className={styles.leftHeader}>
                <h3>Thông tin cơ sở y tế</h3>
              </div>
              <div className={styles.leftBody}>
                {isLoadingHospital ? (
                  <div className="flex items-start gap-2">
                    <Skeleton className="size-5" />
                    <Skeleton className="w-full h-10" />
                  </div>
                ) : (
                  <ul>
                    <li>
                      <HospitalIcon className="size-5 flex-shrink-0" />
                      <div className={styles.hospitalInfo}>
                        <span>{hospital?.payload?.data?.name ?? ""}</span>
                        <p className={styles.address}>
                          {hospital?.payload?.data?.address ?? ""}
                        </p>
                      </div>
                    </li>
                    {specialtyId && (
                      <li>
                        <SuitcaseMedicalIcon className="size-5 flex-shrink-0" />
                        <div className={styles.hospitalInfo}>
                          <span>
                            Chuyên khoa:{" "}
                            {specialty?.payload?.data.find(
                              (v) => v._id === specialtyId
                            )?.name ?? ""}
                          </span>
                        </div>
                      </li>
                    )}
                    {doctorId && (
                      <li>
                        <StethoscopeIcon className="size-5 flex-shrink-0" />
                        <div className={styles.hospitalInfo}>
                          <span>
                            Bác sĩ:{" "}
                            {
                              doctor?.payload?.data.find(
                                (v) => v.doctor_id === doctorId
                              )?.name
                            }
                          </span>
                        </div>
                      </li>
                    )}
                    {serviceId && (
                      <li>
                        <HandHoldingMedicalIcon className="size-5 flex-shrink-0" />
                        <div className={styles.hospitalInfo}>
                          <span>Dịch vụ: {service?.payload?.data?.name}</span>
                        </div>
                      </li>
                    )}
                    {dateSelected && (
                      <li>
                        <CalendarIcon className="size-5 flex-shrink-0" />
                        <div className={styles.hospitalInfo}>
                          <span>Ngày khám: {dateSelected}</span>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="booking-appointment_right">
            <div className={styles.rightContent}>
              <div className={styles.rightHeader}>
                <h3>{generateBookingTitle()}</h3>
              </div>
              {renderRightContent()}
            </div>
            <div className="mt-3">
              <Button variant={"ghost"} onClick={() => router.back()}>
                Quay lại
                <ResetIcon className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DisplaySkeleton() {
  return (
    <div className={styles.rightBody}>
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-[25%] h-10 mt-10" />
      <Skeleton className="w-full h-10 mt-1" />
      <Skeleton className="w-full h-10 mt-1" />
      <Skeleton className="w-full h-10 mt-1" />
    </div>
  );
}
