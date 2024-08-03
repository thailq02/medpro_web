import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {DoubleArrowRightIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import styles from "./HomeNews.module.scss";

const newsFeed = [
  {
    img: "/img/news2.png",
    title: "Viêm phổi ở trẻ em: nguyên nhân và triệu chứng cần lưu ý",
    time: "21/05/2024, 10:01 - BS.ĐOÀN TRỊNH NHÃ KHANH",
  },
  {
    img: "/img/news3.png",
    title: "Khám mạch máu là khám gì? Địa chỉ nào khám mạch máu uy tín?",
    time: "21/05/2024, 10:01 - BS.ĐOÀN TRỊNH NHÃ KHANH",
  },
  {
    img: "/img/news4.png",
    title: "Dấu hiệu viêm phổi ở trẻ phụ huynh cần lưu ý",
    time: "21/05/2024, 10:01 - BS.ĐOÀN TRỊNH NHÃ KHANH",
  },
  {
    img: "/img/news5.png",
    title: "Viêm phổi ở trẻ sơ sinh: Nguyên nhân, dấu hiệu, phòng ngừa",
    time: "21/05/2024, 10:01 - BS.ĐOÀN TRỊNH NHÃ KHANH",
  },
];

export default function HomeNews() {
  return (
    <section className={`home-news ${styles.container}`}>
      <div className={styles.main}>
        <h3 className={styles.title}>Tin tức Y Tế</h3>
        <div className={styles.content}>
          <div className="left">
            <div className={styles.cardLeft}>
              <div className={styles.cardLeftImage}>
                <Image
                  src="/img/news1.png"
                  alt="News"
                  width={500}
                  height={500}
                  className="size-full object-cover"
                />
              </div>
              <div className="cardLeftInfo">
                <h4 className={styles.cardLeftTitle}>
                  Phòng khám sản phụ khoa Dr.Marie chính thức có trên Medpro
                </h4>
                <span className={styles.cardLeftTime}>24/04/2024, 03:14</span>
                <p className={styles.cardLeftDesc}>
                  Từ tháng 04/2024, người bệnh có thể dễ dàng đặt lịch khám
                  chuyên khoa sản, phụ khoa tại Phòng khám sản phụ khoa Dr.Marie
                  qua nền tảng Medpro - Đặt khám nhanh.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            {newsFeed.map((news, index) => (
              <div className={styles.cardRight} key={index}>
                <div className={styles.cardRightImage}>
                  <Image
                    src={news.img}
                    alt="News"
                    width={500}
                    height={500}
                    className="size-full object-cover"
                  />
                </div>
                <div className="cardRightInfo">
                  <h4 className={styles.cardRightTitle}>{news.title}</h4>
                  <div className={styles.cardRightTime}>{news.time}</div>
                </div>
              </div>
            ))}
          </div>
          {/* MOBILE */}
          <Carousel opts={{align: "start"}} className={styles.carousel}>
            <CarouselContent>
              {newsFeed.map((v, index) => (
                <CarouselItem key={index} className={styles.carouselItem}>
                  <div className="p-1">
                    <Card className="shadow-none border-none">
                      <CardContent className={`p-0 ${styles.card}`}>
                        <div className={styles.cardRight} key={index}>
                          <div className={styles.cardRightImage}>
                            <Image
                              src={v.img}
                              alt="News"
                              width={500}
                              height={500}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="cardRightInfo">
                            <h4 className={styles.cardRightTitle}>{v.title}</h4>
                            <div className={styles.cardRightTime}>{v.time}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className={styles.btn}>
          <Button>
            Xem thêm <DoubleArrowRightIcon className="size-5 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
