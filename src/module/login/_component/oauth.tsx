import {FacebookIcon, GoogleIcon} from "@/components/Icon";
import Link from "next/link";
import styles from "../login.module.scss";

const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env
      .NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI as string,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export default function OAuthLogin() {
  const oauthUrl = getOauthGoogleUrl();
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <Link className="p-0" href={oauthUrl}>
        <div className={styles.socialIcon}>
          <GoogleIcon className="size-5" />
        </div>
      </Link>
      <Link className="p-0" href={"#"}>
        <div className={styles.socialIcon}>
          <FacebookIcon className="size-5" />
        </div>
      </Link>
    </div>
  );
}
