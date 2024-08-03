import Image from "next/image";
import Link from "next/link";
import styles from "./HomeDownload.module.scss";

export default function HomeDownload() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          Tải ứng dụng Đặt khám nhanh <span>MEDPRO</span>
        </h3>
        <div className={styles.store}>
          <Link href="#" className="block w-[152px] h-[45px]">
            <Image
              src="/img/icon_ios.svg"
              alt="Icon ios"
              width={1000}
              height={1000}
              className="size-full object-cover"
            />
          </Link>
          <Link href="#" className="block w-[152px] h-[45px]">
            <Image
              src="/img/icon_google_play.svg"
              alt="Icon google play"
              width={1000}
              height={1000}
              className="size-full object-cover"
            />
          </Link>
        </div>
        <div className={styles.service}>
          <div className={styles.left}>
            <div className={styles.serviceBox}>
              <div className={styles.serviceMessageLeft}>
                <h4 className={styles.serviceTitle}>
                  Lấy số thứ tự khám nhanh trực tuyến
                </h4>
                <span className={styles.serviceDesc}>
                  Đăng ký khám / tái khám nhanh theo ngày
                </span>
                <span className={styles.serviceDesc}>
                  Đăng ký khám theo bác sĩ chuyên khoa Tái khám theo lịch hẹn
                </span>
              </div>
              <div className="size-[60px] flex-shrink-0">
                <Image
                  src="/img/icon_dang_ky.svg"
                  width={1000}
                  height={1000}
                  alt="dangky"
                  className="size-full object-cover"
                />
              </div>
            </div>

            <div className={styles.serviceBox}>
              <div className={styles.serviceMessageLeft}>
                <h4 className={styles.serviceTitle}>Tư vấn sức khỏe từ xa</h4>
                <span className={styles.serviceDesc}>
                  Tư vấn sức khỏe từ xa, cuộc gọi video với các bác sĩ chuyên
                  môn
                </span>
              </div>
              <div className="size-[60px] flex-shrink-0">
                <Image
                  src="/img/icon_message.svg"
                  width={1000}
                  height={1000}
                  alt="dangky"
                  className="size-full object-cover"
                />
              </div>
            </div>

            <div className={styles.serviceBox}>
              <div className={styles.serviceMessageLeft}>
                <h4 className={styles.serviceTitle}>
                  Tra cứu kết quả cận lâm sàng
                </h4>
                <span className={styles.serviceDesc}>
                  Tra cứu kết quả cận lâm sàng trực tuyến dễ dàng và tiện lợi
                </span>
              </div>
              <div className="size-[60px] flex-shrink-0">
                <Image
                  src="/img/icon_capcuu.svg"
                  width={1000}
                  height={1000}
                  alt="dangky"
                  className="size-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className={styles.middle}>
            <Image
              src="/img/home_phone.png"
              alt="Dịch vụ Medpro"
              width={1000}
              height={1000}
              className={styles.imgPhone}
            />
            <Image
              src="/img/home_rounded.png"
              alt="Dịch vụ Medpro"
              width={1000}
              height={1000}
              className={styles.rounded}
            />
          </div>

          <div className={styles.right}>
            <div className={styles.serviceBox}>
              <div className="size-[60px] flex-shrink-0">
                <Image
                  src="/img/icon_payment.svg"
                  width={1000}
                  height={1000}
                  alt="dangky"
                  className="size-full object-cover"
                />
              </div>
              <div className={styles.serviceMessageRight}>
                <h4 className={styles.serviceTitle}>Thanh toán viện phí</h4>
                <span className={styles.serviceDesc}>
                  Đa dạng hệ thống thanh toán trực tuyến
                </span>
                <span className={styles.serviceDesc}>
                  Hỗ trợ các ví điện tử thịnh hành hiện nay
                </span>
              </div>
            </div>

            <div className={styles.serviceBox}>
              <div className="size-[60px] flex-shrink-0">
                <Image
                  src="/img/icon_capcuu2.svg"
                  width={1000}
                  height={1000}
                  alt="dangky"
                  className="size-full object-cover"
                />
              </div>
              <div className={styles.serviceMessageRight}>
                <h4 className={styles.serviceTitle}>Chăm sóc Y tế tại nhà</h4>
                <span className={styles.serviceDesc}>
                  Dịch vụ Y tế tại nhà (điều dưỡng, xét nghiệm) chuyên nghiệp,
                  đáp ứng các nhu cầu chăm sóc Y tế tại nhà phổ thông
                </span>
              </div>
            </div>

            <div className={styles.serviceBox}>
              <div className="size-[60px] flex-shrink-0">
                <Image
                  src="/img/icon_mangluoi.svg"
                  width={1000}
                  height={1000}
                  alt="dangky"
                  className="size-full object-cover"
                />
              </div>
              <div className={styles.serviceMessageRight}>
                <h4 className={styles.serviceTitle}>Mạng lưới Cơ sở hợp tác</h4>
                <span className={styles.serviceDesc}>
                  Mạng lưới kết nối với các bệnh viện, phòng khám, phòng mạch
                  rộng khắp phủ sóng toàn quốc
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
