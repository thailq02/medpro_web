import {IHospitalBody} from "@/apiRequest/ApiHospital";
import {HINH_THUC_DAT_KHAM} from "@/apiRequest/common";
import BreadcrumbGlobal from "@/components/BreadcrumbGlobal";
import {ButtonGlobal} from "@/components/ButtonGlobal";
import {HotlineIcon, LocationIcon} from "@/components/Icon";
import Custom500 from "@/components/Layout/ErrorLayout/500";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {generateQueryString} from "@/lib/utils";
import {TimerIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import {twMerge} from "tailwind-merge";
import styles from "./HospitalDetail.module.scss";

export default async function HospitalDetail({
  hospital,
}: {
  hospital: IHospitalBody;
}) {
  if (!hospital) return <Custom500 />;
  const breadcrumb = [
    {label: "Trang chủ", href: "/"},
    {label: hospital?.name ?? "", isActive: true},
  ];
  return (
    <>
      <BreadcrumbGlobal items={breadcrumb} />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className="left">
            <div className={styles.infoWrapper}>
              <div className={styles.logo}>
                <div className={styles.logoImg}>
                  <Image
                    src={hospital?.avatar || "/img/avatar/avatar.jpg"}
                    alt={hospital?.name || "Hospital Image"}
                    width={200}
                    height={200}
                    className="size-full object-contain rounded-lg"
                  />
                </div>
                <h2 className={styles.name}>{hospital?.name}</h2>
              </div>
              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <LocationIcon className="size-4 flex-shrink-0 text-textLightOrange" />
                  <span>{hospital?.address}</span>
                </div>
                <div className={styles.infoItem}>
                  <TimerIcon className="size-5 flex-shrink-0 text-textLightOrange" />
                  <span>{hospital?.session}</span>
                </div>
                <div className={styles.infoItem}>
                  <HotlineIcon className="size-5 flex-shrink-0 text-textLightOrange" />
                  <span>Hỗ trợ đặt khám: {hospital?.hotline}</span>
                </div>
                <ButtonGlobal
                  title="Đặt khám ngay"
                  href={`/${hospital?.slug}/${HINH_THUC_DAT_KHAM}`}
                />
              </div>
            </div>
            <div className={styles.description}>
              <h3>Mô tả</h3>
              <p>{hospital?.description || "Đang cập nhật..."}</p>
            </div>
          </div>
          <div className="right">
            {hospital?.images && !!hospital.images.length && (
              <div className={styles.listImg}>
                <Carousel opts={{loop: true}}>
                  <CarouselContent>
                    {hospital?.images &&
                      hospital?.images.map((img, index) => (
                        <CarouselItem
                          key={index}
                          className={styles.carouselItem}
                        >
                          <Image
                            src={img || "/img/avatar/avatar.jpg"}
                            alt={hospital?.name || "Hospital Image"}
                            width={500}
                            height={500}
                            className="size-full object-center rounded-2xl"
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious
                    className={twMerge(
                      "!hidden !invisible lg:!inline-flex lg:!visible lg:left-5"
                    )}
                  />
                  <CarouselNext
                    className={twMerge(
                      "!hidden !invisible lg:!inline-flex lg:!visible lg:right-5"
                    )}
                  />
                </Carousel>
              </div>
            )}
            <div className={styles.services}>
              <h3>Các dịch vụ</h3>
              <div className="flex gap-2 items-center justify-center flex-wrap">
                {hospital?.booking_forms?.map((v) => (
                  <div className="p-1" key={v.id}>
                    <Card className="border border-transparent transition-all cursor-pointer hover:border-textSecondary">
                      <CardContent className="size-[160px] px-5 py-4">
                        <Link
                          href={generateQueryString({
                            name: v.name || "",
                            hospitalId: hospital?._id || "",
                          })}
                          className={styles.card}
                        >
                          <Image
                            src={v.image ?? "/img/logo.png"}
                            width={100}
                            height={100}
                            alt="logo"
                            className="h-[70px] object-contain flex-shrink-0"
                          />
                          <span className="block flex-1 font-medium leading-tight mt-1">
                            {v.name}
                          </span>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={clsx(
                styles.introduce,
                hospital?.description_detail ? "h-[824px]" : "h-auto"
              )}
            >
              {hospital?.description_detail ? (
                <div
                  className={clsx(styles.paragraph, styles.entryContent)}
                  dangerouslySetInnerHTML={{
                    __html: hospital?.description_detail,
                  }}
                ></div>
              ) : (
                <div className="text-center uppercase text-xl font-bold">
                  Thông tin chi tiết chưa được cập nhật...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
