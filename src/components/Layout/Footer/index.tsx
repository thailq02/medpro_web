import {
  BellIcon,
  ClipboardIcon,
  FileTextIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.scss";

const footerList = [
  {
    title: "Dịch vụ Y tế",
    items: [
      "Đặt khám tại cơ sở",
      "Đặt khám theo bác sĩ",
      "Tư vấn khám bệnh qua video",
      "Đặt lịch xét nghiệm",
      "Gói khám sức khỏe",
      "Đặt lịch tiêm chủng",
      "Y tế tại nhà",
      "Thanh toán Viện phí",
    ],
  },
  {
    title: "Cơ sở y tế",
    items: [
      "Bệnh viện công",
      "Bệnh viện tư",
      "Phòng khám",
      "Phòng mạch",
      "Xét nghiệm",
      "Y tế tại nhà",
      "Tiêm chủng",
    ],
  },
  {
    title: "Hướng dẫn",
    items: [
      "Cài đặt ứng dụng",
      "Đặt lịch khám",
      "Quy trình hoàn phí",
      "Câu hỏi thường gặp",
    ],
  },
  {
    title: "Liên hệ hợp tác",
    items: [
      "Tham gia Medpro",
      "Khám sức khỏe doanh nghiệp",
      "Quảng cáo",
      "Tuyển Dụng",
    ],
  },
  {
    title: "Tin tức",
    items: ["Tin dịch vụ", "Tin Y Tế", "Y Học thường thức"],
  },
  {
    title: "Về Medpro",
    items: [
      "Giới thiệu",
      "Điều khoản dịch vụ",
      "Chính sách bảo mật",
      "Quy định sử dụng",
    ],
  },
];
const orders = [
  {
    img: "/img/dadangky.png",
    alt: "Đã đăng ký",
  },
  {
    img: "/img/bocongthuong.png",
    alt: "Bộ Công Thương",
  },
  {
    img: "/img/icon_ios.svg",
    alt: "IOS",
  },
  {
    img: "/img/icon_google_play.svg",
    alt: "Google Play",
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className="max-w-[220px] max-h-[95px] mb-3">
              <Image
                src="/img/logo_footer.svg"
                width={220}
                height={95}
                alt="logo_footer"
                className="w-full h-full object-cover"
              />
            </div>
            <ul className={styles.leftInfo}>
              <li>
                <span>Địa chỉ:</span> Hoàng Mai, Hà Nội
              </li>
              <li>
                <span>Website:</span> https://lequangthai-medpro.io.vn
              </li>
              <li>
                <span>Email:</span> thai.lq011002@gmail.com
              </li>
            </ul>
          </div>
          <div className={styles.right}>
            {footerList.map((item) => (
              <div className={styles.column} key={item.title}>
                <h3 className={styles.title}>{item.title}</h3>
                <ul className={styles.list}>
                  {item.items.map((subItem, index) => (
                    <li key={index}>
                      <Link href={"#"}>{subItem}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.order}>
          <div className="grid grid-cols-2 gap-2">
            {orders.map((order, index) => (
              <div className={styles.images} key={index}>
                <Image
                  src={order.img}
                  width={100}
                  height={100}
                  alt={order.alt}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.coppyRight}>
        <span className="break-word">
          © 2024 - Bản quyền thuộc Lê Quang Thái
        </span>
        <div className="w-[150px] h-[30px]">
          <Image
            src="/img/dmca-badge.png"
            width={200}
            height={200}
            alt="dmca-badge"
            className="w-full h-full object-cover ml-3"
          />
        </div>
      </div>
      {/* FOOTER MOBILE */}
      <div className={styles.footerMobile}>
        <div className={styles.footerMobileBox}>
          <HomeIcon className={styles.footerMobileIcon} />
          <Link href="/">Trang chủ</Link>
        </div>
        <div className={styles.footerMobileBox}>
          <FileTextIcon className={styles.footerMobileIcon} />
          <Link href={"#"}>Hướng dẫn</Link>
        </div>
        <div className={styles.footerMobileBox}>
          <ClipboardIcon className={styles.footerMobileIcon} />
          <Link href={"#"}>Phiếu khám</Link>
        </div>
        <div className={styles.footerMobileBox}>
          <BellIcon className={styles.footerMobileIcon} />
          <Link href={"#"}>Thông báo</Link>
        </div>
      </div>
    </footer>
  );
}
