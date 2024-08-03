import {IGetHospitalRes} from "@/apiRequest/ApiHospital";
import {CATE} from "@/apiRequest/common";
import BreadcrumbGlobal from "@/components/BreadcrumbGlobal";
import Custom500 from "@/components/Layout/ErrorLayout/500";
import {Button} from "@/components/ui/button";
import {generateQueryString} from "@/lib/utils";
import {ResetIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import styles from "./Booking.module.scss";

export default function MedicalBookingForms({
  hospital,
}: {
  hospital: IGetHospitalRes["data"];
}) {
  if (!hospital) return <Custom500 />;
  const breadcrumb = [
    {label: "Trang chủ", href: "/"},
    {label: hospital?.name ?? ""},
    {label: "Hình thức đặt khám", isActive: true},
  ];
  return (
    <div className="bg-textGrayE8">
      <BreadcrumbGlobal items={breadcrumb} />
      <div className="booking-container">
        <div className={styles.bookingContent}>
          <h1 className={styles.bookingTitle}>Các hình thức đặt khám</h1>
          <span className={styles.bookingDesc}>
            Đặt khám nhanh chóng, không phải chờ đợi với nhiều cơ sở y tế trên
            khắp các tỉnh thành
          </span>
          <div className={styles.bookingList}>
            {hospital?.booking_forms?.map((v) => (
              <Link
                href={generateQueryString({
                  name: v.name ?? "",
                  hospitalId: hospital._id || "",
                })}
                key={v.id}
                className={styles.bookingLink}
              >
                <div className={styles.image}>
                  <Image
                    src={v?.image ?? ""}
                    alt={v?.name ?? ""}
                    width={200}
                    height={200}
                  />
                </div>
                <span className="font-semibold">{v.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-left p-3">
            <Button variant={"ghost"}>
              <ResetIcon className="mr-2 size-4" />
              <Link href={`/${CATE.CSYT}`}>Quay lại</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
