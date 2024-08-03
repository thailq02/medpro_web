import Image from "next/image";
import styles from "./HomeSupport.module.scss";

export default function HomeSupport() {
  return (
    <section className="home-support overflow-hidden px-3">
      <div className="main !max-w-[1180px] w-full mx-auto pb-8">
        <div className="border border-white rounded-xl shadow relative bg-[url('/img/banner_support.png')] bg-center bg-no-repeat bg-cover py-[75px] px-[15px]">
          <div className={styles.content}>
            <div className={styles.image}>
              <Image
                src="/img/mobile.svg"
                alt="Hotline"
                width={100}
                height={100}
                className="object-cover size-full"
              />
            </div>
            <div className="text-center text-white">
              <h4 className="text-[30px] leading-7 whitespace-nowrap uppercase">
                CÁC HÌNH THỨC HỖ TRỢ
              </h4>
              <span className="mt-1 font-bold text-[49px] leading-[57px]">
                1900-2115
              </span>
            </div>
            <div className="text-center flex items-center gap-4">
              <div className="bg-white rounded-lg p-2">
                <div className="min-w-[80px] min-h-[80px]">
                  <Image
                    src="/img/qr_zalo.png"
                    alt="Hotline"
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                </div>
                <span className="inline-block font-medium">Zalo</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="min-w-[80px] min-h-[80px]">
                  <Image
                    src="/img/qr_face.png"
                    alt="Hotline"
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                </div>
                <span className="inline-block font-medium">Facebook</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
