import Image from "next/image";
import styles from "./HomeAchievement.module.scss";

const logos = [
  {
    img: "/img/thanh-nien-logo.png",
    alt: "Báo thanh niên",
  },
  {
    img: "/img/tuoi-tre-logo.png",
    alt: "Báo tuổi trẻ",
  },
  {
    img: "/img/bao-nhan-dan.png",
    alt: "Báo nhân dân",
  },
  {
    img: "/img/nguoi-lao-dong-logo.png",
    alt: "Báo người lao động",
  },
  {
    img: "/img/htv.png",
    alt: "HTV",
  },
  {
    img: "/img/btv-logo.svg",
    alt: "BTV",
  },
  {
    img: "/img/vtv1-logo.png",
    alt: "VTV1",
  },
  {
    img: "/img/thvl-logo.png",
    alt: "THVL",
  },
];

export default function HomeAchievement() {
  return (
    <section className={`home-achievement ${styles.container}`}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h4 className={styles.title}>Truyền thông nói gì về Medpro</h4>
          <span className={styles.desc}>
            Lợi ích của Ứng dụng đặt khám nhanh Medpro đã được ghi nhận rộng rãi
          </span>
        </div>
        <div className={styles.logo}>
          {logos.map((logo, index) => (
            <Image
              key={index}
              src={logo.img}
              alt={logo.alt}
              width={500}
              height={500}
              className="w-full h-[52px] object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
