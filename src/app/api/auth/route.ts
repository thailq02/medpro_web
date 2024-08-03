import {IStatus, REFRESH_TOKEN} from "@/apiRequest/common";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // console.log("request ~ body", body);
  const access_token = body?.access_token as string;
  const refresh_token = body?.refresh_token as string;
  const expiresAt = body?.expiresAt as number;
  if (!access_token && !refresh_token) {
    return Response.json(
      {message: "Không nhận được access_token và refresh_token"},
      {status: IStatus.ERROR}
    );
  }
  cookies().set(REFRESH_TOKEN, refresh_token, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
  });
  const expiredDate = new Date(expiresAt * 1000).toUTCString();
  const response = NextResponse.json(body, {
    status: IStatus.SUCCESS,
  });
  response.headers.set(
    "Set-Cookie",
    `accessToken=${access_token}; Path=/; HttpOnly; Expires=${expiredDate}; SameSite=Lax; Secure`
  );
  return response;
}
