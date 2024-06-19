import {Button} from "@/components/ui/button";
import {HomeIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Custom500() {
  return (
    <div className=" bg-[#e8f2f7] min-h-[65vh] text-textPrimary">
      <div className="max-w-[1140px] w-full mx-auto flex items-center justify-center flex-col">
        <div className="w-[500px] h-[500px]">
          <Image
            src="/img/avatar/500.svg"
            alt="500"
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold mb-5">
          Lỗi hệ thống vui lòng chờ trong ít phút !.
        </h3>
        <Button variant={"ghost"} className="mb-5">
          <Link
            href="/"
            className="flex items-center gap-1 text-textSecondary font-bold"
          >
            <HomeIcon className="w-4 h-4" />
            Trở về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}
