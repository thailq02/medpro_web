import apiAuthRequest from "@/apiRequest/ApiAuth";
import {ACCESS_TOKEN, IStatus, REFRESH_TOKEN} from "@/apiRequest/common";
import {HttpError} from "@/apiRequest/http";
import {cookies} from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const body = await request.json();
  const force = body.force as boolean | undefined;
  // Nếu mà body truyền force lên thì sẽ tự động đăng xuất mà ko cần hỏi
  if (force) {
    cookies().delete(REFRESH_TOKEN);
    cookies().delete(ACCESS_TOKEN);
    return Response.json(
      {message: "Bạn buộc phải đăng xuất"},
      {status: IStatus.SUCCESS}
    );
  }
  const accessToken = cookieStore.get(ACCESS_TOKEN);
  const refreshToken = cookieStore.get(REFRESH_TOKEN);
  if (!accessToken || !refreshToken) {
    return Response.json(
      {message: "Không nhận được access_token và refresh_token"},
      {status: IStatus.UNAUTHORIZED}
    );
  }
  try {
    const res = await apiAuthRequest.logoutFromNextServerToNextServer({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    });
    cookies().delete(REFRESH_TOKEN);
    cookies().delete(ACCESS_TOKEN);
    return Response.json(res.payload, {
      status: IStatus.SUCCESS,
      // headers: {
      //    "Set-Cookie": `accessToken= ; Path=/; HttpOnly; Max-Age=0`,
      // },
    });
  } catch (error) {
    console.log("Next-Server->Logout", error);
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {message: "Lỗi không xác định"},
        {status: IStatus.INTERNAL_SERVER_ERROR}
      );
    }
  }
}
