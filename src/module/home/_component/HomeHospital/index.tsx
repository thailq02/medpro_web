import apiHospital, {IGetListHospitalRes} from "@/apiRequest/ApiHospital";
import {QUERY_PARAMS} from "@/apiRequest/common";
import {Card, CardContent} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import styles from "./HomeHospital.module.scss";

export default async function HomeHospital() {
  let hospitals: IGetListHospitalRes["data"] | null = null;
  try {
    const result = await apiHospital.getListHospital(QUERY_PARAMS);
    hospitals = result?.payload?.data;
  } catch (error) {
    hospitals = null;
    console.log("HomeHospital", error);
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Bệnh viện tiêu biểu</h2>
      <span className={styles.desc}>
        Đặt lịch khám với hơn 70 bệnh viện trên khắp cả nước
      </span>
      <Carousel opts={{align: "start"}} className={styles.carousel}>
        <CarouselContent>
          {hospitals?.map((v) => (
            <CarouselItem key={v._id} className={styles.carouselItem}>
              <div className="p-1">
                <Card className="shadow-none border-none">
                  <CardContent className={`p-0 ${styles.card}`}>
                    <div className={styles.cardImage}>
                      <Image
                        src={v.avatar || "/img/home_banner.png"}
                        alt={v.name || "hospital"}
                        width={500}
                        height={500}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className={styles.cardName}>{v.name}</h3>
                      <p className={styles.cardAddress}>{v.address}</p>
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
    </section>
  );
}
