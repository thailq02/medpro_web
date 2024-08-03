"use client";
import apiHospital from "@/apiRequest/ApiHospital";
import {
  HINH_THUC_DAT_KHAM,
  HospitalsType,
  LIMIT,
  PAGE,
} from "@/apiRequest/common";
import {ButtonGlobal, ButtonViewDetail} from "@/components/ButtonGlobal";
import {LocationIcon} from "@/components/Icon";
import EmptyList from "@/components/Layout/EmptyList";
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
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import styles from "./FacilityBooking.module.scss";
const PaginationSection = dynamic(
  () => import("@/components/PaginationSection"),
  {ssr: false}
);

const TYPE = {
  ALL: "all",
  HOSPITAL: "hospital",
  OTHERS: "others",
} as const;

const typeOfHospitals = [
  {name: "Tất cả", value: TYPE.ALL},
  {name: "Bệnh viện", value: TYPE.HOSPITAL},
  {name: "Phòng khám/ Phòng mạch/ Xét nghiệm/ Khác", value: TYPE.OTHERS},
];

export default function FacilityBooking() {
  const [active, setActive] = useState<string>(TYPE.ALL);
  const [currentPage, setCurrentPage] = useState<number>(PAGE);
  const [itemsPerPage, _] = useState<number>(LIMIT);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const searchValueDebounce = useDebounce(search, 500);

  const page = active === TYPE.ALL ? currentPage : PAGE;
  const limit = active === TYPE.ALL ? itemsPerPage : 99;

  const {data: hospitals, isLoading: isLoadingHospital} = useQuery({
    queryKey: [
      QUERY_KEY.GET_LIST_HOSPITALS,
      {page, limit, search: searchValueDebounce},
    ],
    queryFn: async () =>
      apiHospital.getListHospital({page, limit, search: searchValueDebounce}),
  });

  useEffect(() => {
    document.body.scrollIntoView({behavior: "smooth", block: "start"});
  }, [currentPage]);

  const hospitalDataFilter = hospitals?.payload?.data?.filter((v) => {
    switch (active) {
      case TYPE.HOSPITAL:
        return v.types?.some(
          (type) =>
            type === HospitalsType.BENHVIENCONG ||
            type === HospitalsType.BENHVIENTU
        );
      case TYPE.OTHERS:
        return v.types?.some(
          (type) =>
            type === HospitalsType.PHONGKHAM ||
            type === HospitalsType.PHONGMACH ||
            type === HospitalsType.XETNGHIEM ||
            type === HospitalsType.YTETAINHA ||
            type === HospitalsType.TIEMCHUNG
        );
      default:
        return true;
    }
  });

  const hospitalData =
    active === TYPE.ALL ? hospitals?.payload?.data : hospitalDataFilter;

  return (
    <>
      <div className={styles.bannerWrapper}>
        <div className={styles.bannerContainer}>
          <div className={styles.card}>
            <h1 className={styles.title}>Đặt khám tại cơ sở</h1>
            <span className={styles.desc}>
              Đặt khám nhanh chóng, tiết kiệm thời gian, an toàn tiện lợi
            </span>
          </div>
          <div className={styles.bannerImage}>
            <Image
              src="/img/facility-booking.png"
              alt="Banner"
              width={1000}
              height={1000}
              className="size-full object-center"
            />
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.search}>
            <MagnifyingGlassIcon className="size-5" />
            <input
              type="search"
              placeholder="Nhập tên cơ sở y tế"
              onChange={(e) => setSearch(e.target.value)}
            />
            <LocationIcon className="size-4" />
            <Select>
              <SelectTrigger className="w-[180px] border-none outline-none  focus:ring-transparent">
                <SelectValue placeholder="Tất cả địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="null">Tất cả địa điểm</SelectItem>
                  <SelectItem value="hà nội">Thành phố Hà nội</SelectItem>
                  <SelectItem value="hcm">Thành phố Hồ Chí Minh</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ul className={styles.tag}>
            {typeOfHospitals?.map((cate) => (
              <li key={cate.name}>
                <ButtonGlobal
                  title={cate.name}
                  onClick={() => setActive(cate.value)}
                  className={clsx(
                    styles.tagItem,
                    active === cate.value && styles.active
                  )}
                />
              </li>
            ))}
          </ul>
          <div className={styles.listHospital}>
            {!isLoadingHospital ? (
              hospitalData?.map((v) => (
                <div
                  key={v._id}
                  className={`bg-white rounded-2xl size-full border-2 hover:border-textSecondary transition-all`}
                  role="button"
                  onClick={() =>
                    router.push(`/${v.slug}/${HINH_THUC_DAT_KHAM}`)
                  }
                >
                  <div className={styles.box}>
                    <div className={styles.hospitalBox}>
                      <div className={styles.hospitalImage}>
                        <Image
                          src={v.avatar || "/img/avatar/avatar.jpg"}
                          width={500}
                          height={500}
                          alt="image"
                        />
                      </div>
                      <div className={styles.hospitalInfo}>
                        <h2 className={styles.hospitalTitle}>{v.name}</h2>
                        <div className={styles.hospitalDesc}>
                          <LocationIcon className={styles.hospitalIcon} />
                          {v.address}
                        </div>
                        <div className={styles.btnControl}>
                          <ButtonViewDetail title="Xem chi tiết" />
                          <ButtonGlobal
                            title="Đặt khám ngay"
                            href={`/${v.slug}/${HINH_THUC_DAT_KHAM}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* MOBILE */}
                  <div className={styles.mobile}>
                    <div className={styles.btnControl}>
                      <ButtonViewDetail title="Xem chi tiết" />
                      <ButtonGlobal
                        title="Đặt khám ngay"
                        href={`/${v.slug}/${HINH_THUC_DAT_KHAM}`}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <SkeletonLoading />
            )}
          </div>
          {!hospitalData?.length && !isLoadingHospital && <EmptyList />}
          <div className="mt-5">
            {active === TYPE.ALL && !!hospitalData?.length && (
              <PaginationSection
                currentPage={hospitals?.payload?.meta?.current_page as number}
                totalPages={hospitals?.payload?.meta?.total_page as number}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SkeletonLoading() {
  return Array.from({length: 8}).map((_, index) => (
    <div
      className="bg-white w-full rounded-2xl p-3 flex items-start gap-4"
      key={index}
    >
      <div>
        <Skeleton className="size-[80px]" />
      </div>
      <div className="w-full">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-5 mt-2" />
        <Skeleton className="w-full h-5 mt-2" />
        <div className="flex items-center gap-3 mt-3">
          <Skeleton className="w-1/2 h-9 rounded-full mt-2" />
          <Skeleton className="w-1/2 h-9 rounded-full mt-2" />
        </div>
      </div>
    </div>
  ));
}
