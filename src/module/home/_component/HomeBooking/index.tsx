import {Button} from "@/components/ui/button";
import Image from "next/image";
import styles from "./HomeBooking.module.scss";

export default function HomeBooking() {
  return (
    <section className={styles.container}>
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={`home-booking_left ${styles.left}`}>
            <h3 className={styles.title}>
              Đặt khám nhanh - Lấy số thứ tự trực tuyến
            </h3>
            <p className={styles.desc}>
              Bệnh nhân chủ động chọn thông tin đặt khám nhanh (ngày khám, giờ
              khám và cơ sở y tế). Bệnh nhân sẽ nhận lấy số thứ tự trực tuyến
              ngay trên phần mềm
            </p>
            <Button className={styles.btn}>Đặt lịch ngay</Button>
          </div>
          <div className={`home-booking_right`}>
            <Image
              src="/img/home_doctor.png"
              alt="Ảnh quảng bá Medpro"
              width={1000}
              height={1000}
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className={styles.overlay}></div>
    </section>
  );
}
