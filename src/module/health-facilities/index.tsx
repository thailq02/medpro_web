"use client";
import apiCategoryRequest from "@/apiRequest/ApiCategory";
import apiHospital, {IHospitalBody} from "@/apiRequest/ApiHospital";
import {HospitalsType, LIMIT, PAGE, QUERY_PARAMS} from "@/apiRequest/common";
import {LocationIcon} from "@/components/Icon";
import PaginationSection from "@/components/PaginationSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {generateDescription} from "@/lib/utils";
import {ClockIcon} from "@radix-ui/react-icons";
import {useQuery} from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import styles from "./HealthFacilities.module.scss";

const CSYT = "co-so-y-te";
const typeMapping = {
  "benh-vien-cong": HospitalsType.BENHVIENCONG,
  "benh-vien-tu": HospitalsType.BENHVIENTU,
  "phong-kham": HospitalsType.PHONGKHAM,
  "phong-mach": HospitalsType.PHONGMACH,
  "xet-nghiem": HospitalsType.XETNGHIEM,
  "y-te-tai-nha": HospitalsType.YTETAINHA,
  "tiem-chung": HospitalsType.TIEMCHUNG,
};

export default function HealthFacilities({slug}: {slug?: string}) {
  const [hospitalSelected, setHospitalSelected] =
    useState<IHospitalBody | null>(null);
  const [isActive, setIsActive] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(PAGE);
  const [itemsPerPage, _] = useState<number>(LIMIT);
  const [searchValue, setSearchValue] = useState<string>("");

  const pathname = usePathname();
  const isActivePath = slug
    ? pathname === `/${CSYT}/${slug}`
    : pathname === `/${CSYT}`;

  const {data: categories, isLoading: isLoadingCategory} = useQuery({
    queryKey: [QUERY_KEY.GET_LIST_CATEGORY],
    queryFn: async () => await apiCategoryRequest.getListCategory(QUERY_PARAMS),
  });

  const {data: hospitals, isLoading: isLoadingHospital} = useQuery({
    queryKey: [
      QUERY_KEY.GET_LIST_HOSPITALS,
      {
        page: currentPage,
        limit: itemsPerPage,
        types: type,
        search: searchValue,
      },
    ],
    queryFn: async () =>
      apiHospital.getListHospital({
        page: currentPage,
        limit: itemsPerPage,
        types: type,
        search: searchValue,
      }),
  });

  useEffect(() => {
    if (slug && slug in typeMapping) {
      setType(typeMapping[slug as keyof typeof typeMapping].toString());
    }
  }, [hospitals?.payload?.data, slug]);

  const hospitalInfomation = Boolean(hospitalSelected)
    ? hospitalSelected
    : hospitals?.payload.data[0];

  const getNameCategory = () => {
    if (slug) {
      return categories?.payload?.data.find((cate) => cate.slug === slug)?.name;
    }
    return categories?.payload?.data.find((cate) => cate.slug === CSYT)?.name;
  };

  const parentCategory = categories?.payload?.data.find(
    (cate) => cate.slug === CSYT
  );

  const typeOfHospitals = categories?.payload?.data.filter(
    (v) => v.parent_id === parentCategory?._id
  );

  return (
    <>
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbContainer}>
          <Breadcrumb className={styles.breadcrumbs}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className={styles.breadcrumbLink}>
                  Trang chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  className={clsx(
                    styles.breadcrumbLink,
                    isActivePath && styles.activeLink
                  )}
                >
                  {getNameCategory()}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className={styles.hospitalContainer}>
        <div className={styles.header}>
          {isLoadingCategory ? (
            <>
              <Skeleton className="w-[35%] h-10 mx-auto" />
              <Skeleton className="w-[45%] h-10 mx-auto mt-2" />
            </>
          ) : (
            <>
              <h1 className={styles.hospitalTitle}>{getNameCategory()}</h1>
              <span className={styles.hospitalDesc}>
                {slug
                  ? generateDescription(slug)
                  : "Với những cơ sở Y Tế hàng đầu sẽ giúp trải nghiệm khám, chữa bệnh của bạn tốt hơn"}
              </span>
            </>
          )}
          <div className={styles.search}>
            <Input
              type="text"
              placeholder="Tìm kiếm cơ sở y tế..."
              className="health-facilities_search"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <ul className={styles.tag}>
          {typeOfHospitals?.map((cate) => (
            <li key={cate._id}>
              <Button
                className={clsx(
                  styles.tagItem,
                  cate.slug === slug && styles.activeTagItem
                )}
                asChild
              >
                <Link href={`/${CSYT}/${cate.slug}`}>{cate.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      {/* CONTAINER */}
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.listHospital}>
            <div className={styles.left}>
              <div className={styles.leftBoxContainer}>
                {isLoadingHospital ? (
                  <>
                    {Array.from({length: 3}).map((_, index) => (
                      <Skeleton className="w-full h-40 mx-auto" key={index} />
                    ))}
                  </>
                ) : (
                  hospitals?.payload?.data?.map((v) => (
                    <div
                      key={v._id}
                      className={`bg-white rounded-2xl w-full border-2 ${
                        v._id === isActive ? "border-[#00b5f1]" : ""
                      } hover:border-[#00b5f1] transition-all`}
                      role="button"
                      onClick={() => {
                        setHospitalSelected(v);
                        setIsActive(v._id as string);
                      }}
                    >
                      <div className={styles.leftBox}>
                        <div className={styles.leftImage}>
                          <Image
                            src={v.avatar || "/img/avatar/avatar.jpg"}
                            width={500}
                            height={500}
                            alt="image"
                          />
                        </div>
                        <div className={styles.leftInfo}>
                          <h2 className={styles.leftTitle}>{v.name}</h2>
                          <div className={styles.leftDesc}>
                            <LocationIcon className={styles.leftIcon} />
                            {v.address}
                          </div>
                          <div className={styles.leftBtnControl}>
                            <Button className={styles.btnMore}>
                              Xem chi tiết
                            </Button>
                            <Button className={styles.btnBooking} asChild>
                              <Link href={`/${v.slug}/hinh-thuc-dat-kham`}>
                                Đặt khám ngay
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                      {/* MOBILE */}
                      <div className={styles.mobile}>
                        <div className={styles.leftBtnControl}>
                          <Button className={styles.btnMore}>
                            Xem chi tiết
                          </Button>
                          <Button className={styles.btnBooking} asChild>
                            <Link href={`/${v.slug}/hinh-thuc-dat-kham`}>
                              Đặt khám ngay
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.rightHospitalInfo}>
                <div className={styles.rightHeader}>
                  <div className={styles.rightImage}>
                    <Image
                      src={
                        hospitalInfomation?.avatar || "/img/avatar/avatar.jpg"
                      }
                      width={500}
                      height={500}
                      alt={hospitalInfomation?.name || "image"}
                    />
                  </div>
                  <h3 className={styles.rightTitle}>
                    {hospitalInfomation?.name || "Chưa cập nhập!!"}
                  </h3>
                  <div className={styles.rightSession}>
                    <ClockIcon className="w-5 h-5 text-[#ffb54a] inline-block" />
                    <span>{hospitalInfomation?.session}</span>
                  </div>
                </div>
                <p className={styles.rightDesc}>
                  {hospitalInfomation?.description || "Chưa cập nhập!!"}
                </p>
                <div className={styles.rightImages}>
                  <h4>Ảnh</h4>
                  {!!hospitalInfomation?.images?.length ? (
                    <div className={styles.rightImageList}>
                      {hospitalInfomation?.images?.map((image, index) => (
                        <div key={index} className={styles.rightImageItem}>
                          <Image
                            src={image}
                            width={110}
                            height={110}
                            alt="image"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>Chưa cập nhập!!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <PaginationSection
              currentPage={hospitals?.payload?.meta?.current_page as number}
              totalPages={hospitals?.payload?.meta?.total_page as number}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
