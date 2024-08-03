import Image from "next/image";
import styles from "./EmptyList.module.scss";

export default function EmptyList() {
  return (
    <div className={styles.emptyList}>
      <p>Không tìm thấy dữ liệu cần tìm</p>
      <div className="size-[300px]">
        <Image
          src="/img/EmptyList.png"
          width={300}
          height={300}
          alt="empty-list"
          className="size-full object-contain"
        />
      </div>
    </div>
  );
}
