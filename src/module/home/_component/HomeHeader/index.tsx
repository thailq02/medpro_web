import apiSearch from "@/apiRequest/ApiSearch";
import {CATE} from "@/apiRequest/common";
import {Skeleton} from "@/components/ui/skeleton";
import HomeInfo from "@/module/home/_component/HomeHeader/HomeInfo";
import HomeSearch from "@/module/home/_component/HomeHeader/HomeSearch";
import HomeStatistic from "@/module/home/_component/HomeHeader/HomeStatistic";
import Await from "@/module/home/_component/HomeHeader/await";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {Suspense} from "react";
import styles from "./HomeHeader.module.scss";
const HomeService = dynamic(
  () => import("@/module/home/_component/HomeHeader/HomeService")
);
const LIMIT = 4;

export default async function HomeHeader({searchKey}: {searchKey?: string}) {
  const promise = apiSearch.search({
    category: "all",
    limit: LIMIT,
    search_key: searchKey,
  });
  return (
    <section className={`home-header ${styles.container}`}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <span className="text-[#11a2f3] text-[25px] mb-2 font-medium">
            Nền tảng công nghệ
          </span>
          <h3 className={styles.title}>
            Kết nối người dân với Cơ sở - Dịch vụ Y tế
          </h3>
          <div className={styles.searchContainer}>
            <HomeSearch placeholder="Tìm kiếm cơ sở y tế" />
            <div className={styles.searchBox}>
              <Suspense fallback={<SkeletionLoading />}>
                <Await promise={promise}>
                  {(searchData) => (
                    <>
                      {!!searchData?.payload?.data?.hospital?.length &&
                        searchKey !== "" && (
                          <>
                            <div className="flex items-center justify-between p-3 bg-[#e6f2ff]">
                              <h3 className="font-bold">Cơ sở y tế</h3>
                              <Link
                                href={`/${CATE.CSYT}`}
                                className="text-sm italic text-textSecondary hover:underline"
                              >
                                Xem tất cả
                              </Link>
                            </div>
                            {searchData?.payload?.data.hospital?.map(
                              (value) => (
                                <Link
                                  href={`/${value.slug}`}
                                  className={styles.searchBoxItem}
                                  key={value._id}
                                >
                                  <div className={styles.searchBoxImage}>
                                    <Image
                                      src={
                                        value.avatar || "/img/avatar/avatar.jpg"
                                      }
                                      width={80}
                                      height={80}
                                      alt="search-box"
                                    />
                                  </div>
                                  <div className={styles.searchBoxContent}>
                                    <h4 className={styles.searchBoxTitle}>
                                      {value.name}
                                    </h4>
                                    <span className={styles.searchBoxDesc}>
                                      {value.address}
                                    </span>
                                  </div>
                                </Link>
                              )
                            )}
                          </>
                        )}
                      {!!searchData?.payload?.data.doctor?.length &&
                        searchKey !== "" && (
                          <>
                            <div className="flex items-center justify-between p-3 bg-[#e6f2ff]">
                              <h3 className="font-bold">Bác sĩ</h3>
                              <Link
                                href="#"
                                className="text-sm italic text-textSecondary hover:underline"
                              >
                                Xem tất cả
                              </Link>
                            </div>
                            {searchData?.payload?.data.doctor?.map((value) => (
                              <Link
                                href={`#`}
                                className={styles.searchBoxItem}
                                key={value._id}
                              >
                                <div className={styles.searchBoxImage}>
                                  <Image
                                    src={
                                      value.avatar || "/img/avatar/avatar.jpg"
                                    }
                                    width={80}
                                    height={80}
                                    alt="search-box"
                                  />
                                </div>
                                <div className={styles.searchBoxContent}>
                                  <h4 className={styles.searchBoxTitle}>
                                    {value.name} -{" "}
                                    {value.specialty?.hospital?.name}
                                  </h4>
                                  <span className={styles.searchBoxDesc}>
                                    {value.specialty?.name}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </>
                        )}
                    </>
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
          <span className={styles.desc}>
            Đặt khám nhanh - Lấy số thứ tự trực tuyến - Tư vấn sức khỏe từ xa
          </span>
        </div>
        <HomeService />
      </div>
      <div className={styles.main}>
        <HomeInfo />
        <HomeStatistic />
      </div>
    </section>
  );
}

function SkeletionLoading() {
  return (
    <div className="bg-white p-3">
      {Array.from({length: 2}).map((_, index) => (
        <div className="flex items-start gap-4 mt-4" key={index}>
          <Skeleton className="size-10 rounded-full" />
          <div className="w-full">
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-full h-10 mt-4" />
            <Skeleton className="w-full h-10 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
