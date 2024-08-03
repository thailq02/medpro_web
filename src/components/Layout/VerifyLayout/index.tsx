"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN,
} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {VerifyIcon} from "@/components/Icon";
import {Button} from "@/components/ui/button";
import {QUERY_KEY} from "@/hooks/QUERY_KEY";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useContext, useEffect} from "react";

interface IVerifyProps {
  isError: boolean;
  title?: string;
  description?: string;
  isForgotPassword?: boolean;
  token?: string;
  isVerifyEmailSuccess?: boolean;
  verifyEmailPayload?: {
    new_access_token: string;
    new_refresh_token: string;
    expiredAt: number;
  };
}

export default function VerifyLayout({
  isError,
  title,
  description,
  isForgotPassword = false,
  token = "",
  isVerifyEmailSuccess,
  verifyEmailPayload,
}: IVerifyProps) {
  const router = useRouter();
  const {setUser} = useContext(AppContext);
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN) : "";

  const newAccessToken = verifyEmailPayload?.new_access_token as string;
  const newRefreshToken = verifyEmailPayload?.new_refresh_token as string;
  const expiredAt = verifyEmailPayload?.expiredAt as number;

  const me = useQuery({
    queryKey: [QUERY_KEY.GET_ME, accessToken],
    queryFn: async () => await apiAuthRequest.getMe(accessToken || ""),
    enabled: isVerifyEmailSuccess && !!accessToken,
  });

  useEffect(() => {
    if (me.data && isVerifyEmailSuccess) {
      setUser(me.data.payload.data);
      localStorage.setItem(ACCESS_TOKEN, newAccessToken);
      localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
      localStorage.setItem(ACCESS_TOKEN_EXPIRED, expiredAt.toString());
      const setCookie = async () => {
        await apiAuthRequest.auth({
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
          expiresAt: expiredAt,
        });
      };
      setCookie();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifyEmailSuccess, me.data]);
  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      {isError ? (
        <>
          <div className="mt-16 text-red-600">
            <VerifyIcon className="size-32" />
          </div>
          <h1 className="text-3xl font-bold mt-3 text-red-600">
            {title ? title : "Xác thực thất bại"}
          </h1>
          <p className="mt-3 font-medium">
            {description
              ? description
              : "Xác thực tài khoản thất bại. Vui lòng thử lại...."}
          </p>
        </>
      ) : (
        <>
          <div className="mt-16 text-[#6BC839]">
            <VerifyIcon className="size-32" />
          </div>
          <h1 className="text-3xl font-bold mt-3">
            {title ? title : "Xác thực thành công"}
          </h1>
          <p className="mt-3 font-medium">
            {description
              ? description
              : "Xác thực tài khoản thành công. Bạn có thể đặt lịch khám bệnh với bác sĩ ngay bây giờ..."}
          </p>
        </>
      )}
      {!isForgotPassword ? (
        <Button
          className="mt-4"
          onClick={() => {
            router.refresh();
            router.push("/");
          }}
        >
          Trang chủ
        </Button>
      ) : (
        <Button className="mt-4" asChild>
          <Link href={{pathname: "/reset-password", query: {token}}}>
            Cập nhật mật khẩu mới
          </Link>
        </Button>
      )}
    </div>
  );
}
