import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import styles from "./HomeHeader.module.scss";

export default function HomeInfo() {
  return (
    <div className={styles.homeInfo}>
      <div className={styles.homeHeader}>
        <div className="basis-[100%]">
          <Image
            src="/img/logo.png"
            alt="Logo"
            width={170}
            height={170}
            className="w-[170px] h-[50px] object-contain"
          />
          <span className={styles.homeHeaderTitle}>Đặt khám nhanh</span>
        </div>
        <p>
          <strong>Medpro</strong> cung cấp dịch vụ đặt lịch khám bệnh và chăm
          sóc sức khỏe trực tuyến tại các bệnh viện hàng đầu Việt Nam như Bệnh
          viện Đại học Y Dược TP.HCM, Bệnh viện Chợ Rẫy và Bệnh viện Nhi Đồng,
          giúp người dùng tự lựa chọn dịch vụ và bác sĩ theo nhu cầu của mình.
        </p>
      </div>
      <div className={styles.homeCard}>
        {Array.from({length: 3}).map((_, index) => (
          <div className={styles.homeCardBox} key={index}>
            <div className="h-[260px] w-full">
              <Image
                src="/img/home_info.png"
                alt="home_info"
                width={500}
                height={500}
                className="size-full object-cover rounded-2xl"
              />
            </div>
            <h4 className={styles.homeTitle}>Vì thời gian của bạn là vô giá</h4>
            <span className={styles.homeDesc}>
              Bệnh nhân chủ động chọn thông tin đặt khám (ngày khám và giờ khám)
            </span>
            <Button>Xem thêm</Button>
          </div>
        ))}
      </div>
      {/* Tablet */}
      <Carousel opts={{align: "start"}} className={styles.tablet_carousel}>
        <CarouselContent>
          {Array.from({length: 3}).map((_, index) => (
            <CarouselItem className={styles.tablet_carouselItem} key={index}>
              <div className="py-1">
                <Card>
                  <CardContent className={`px-5 py-4`}>
                    <div className={styles.tablet_homeCardBox} key={index}>
                      <div className="h-[260px] w-full">
                        <Image
                          src="/img/home_info.png"
                          alt="home_info"
                          width={500}
                          height={500}
                          className="size-full object-cover rounded-2xl"
                        />
                      </div>
                      <h4 className={styles.homeTitle}>
                        Vì thời gian của bạn là vô giá
                      </h4>
                      <span className={styles.homeDesc}>
                        Bệnh nhân chủ động chọn thông tin đặt khám (ngày khám và
                        giờ khám)
                      </span>
                      <Button>Xem thêm</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
