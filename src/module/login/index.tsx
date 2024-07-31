import apiAuthRequest, {IGetMeResBody} from "@/apiRequest/ApiAuth";
import LoginForm from "@/module/login/_component/login-form";
import OAuthLogin from "@/module/login/_component/oauth";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import clsx from "clsx";
import {jwtDecode} from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import styles from "./login.module.scss";

export default async function Login({
  searchParams,
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  let profile: IGetMeResBody["data"] | null = null;
  let accessToken: string | null = null;
  let refreshToken: string | null = null;
  let expiredAt: number | null = null;
  try {
    if (searchParams.access_token && searchParams.refresh_token) {
      accessToken = searchParams.access_token as string;
      refreshToken = searchParams.refresh_token as string;
      const decoded = jwtDecode(accessToken);
      expiredAt = decoded.exp ? decoded.exp : 0;
      const [_, user] = await Promise.all([
        fetch("/api/auth", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            expiresAt: expiredAt,
          }),
        }),
        apiAuthRequest.getMe(accessToken),
      ]);
      profile = user.payload.data;
    }
  } catch (error) {
    console.log("Login ~ error", error);
    profile = null;
    accessToken = null;
    refreshToken = null;
    expiredAt = null;
  }
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={clsx(styles.formContainer, styles.signIn)}>
          <Link
            href={"/"}
            className="flex items-center justify-center text-center h-[60px] mt-8"
          >
            <Image
              src="/img/logo.png"
              width={250}
              height={60}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </Link>
          <div className="text-center">
            <h1 className={styles.title}>Đăng nhập</h1>
            <OAuthLogin />
            <span className="text-center text-sm mt-2">
              Hoặc đăng nhập bằng tài khoản
            </span>
          </div>
          <LoginForm
            profile={profile}
            access_token={accessToken}
            refresh_token={refreshToken}
            expired_at={expiredAt}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-2">
            <Link className="font-bold flex items-center" href={"/register"}>
              <span>Create your account</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
        <div className={styles.toggleContainer}>
          <div className={styles.right}>
            <div className={styles.shape}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
