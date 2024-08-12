import {Button} from "@/components/ui/button";
import {HomeIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className=" bg-textGrayE8 min-h-[65vh] text-textPrimary p-2">
      <div className="max-w-[1140px] w-full mx-auto flex items-center justify-center flex-col">
        <div className="size-[300px] screen-576:size-[400px] sm:size-[500px]">
          <Image
            src="/img/avatar/404.svg"
            alt="500"
            width={500}
            height={500}
            className="size-full object-contain"
          />
        </div>
        <h3 className="text-xl font-semibold mb-5 text-center">
          Trang bạn tìm kiếm không đúng hoặc không tồn tại !.
        </h3>
        <Button variant={"ghost"} className="mb-5 text-lg">
          <Link
            href="/"
            className="flex items-center gap-1 text-textSecondary font-bold"
          >
            <HomeIcon className="size-5" />
            Trở về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}
