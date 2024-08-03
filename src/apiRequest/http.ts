import displayError from "@/apiRequest/ErrorMessage/errors";
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED,
  IStatus,
  PROFILE,
  ParamsType,
  REFRESH_TOKEN,
  isClient,
} from "@/apiRequest/common";
import {toast} from "@/components/ui/use-toast";
import {redirect} from "next/navigation";

type EntityErrorPayload = {
  message: string;
  errors: {
    [key: string]: {
      msg: string | {message: string; status: number};
      path: string;
      [key: string]: any;
    };
  };
};

export interface IDataError {
  errorCode: string;
  errorMessage?: any;
}

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({status, payload}: {status: number; payload: any}) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status = IStatus.UNPROCESSABLE_ENTITY;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: number;
    payload: EntityErrorPayload;
  }) {
    super({status, payload});
    this.status = status;
    this.payload = payload;
  }
}

type CustomOptions = Omit<IFetcherOptions, "method"> & {
  baseUrl?: string | undefined;
};

interface IFetcherOptions extends RequestInit {
  params?: ParamsType;
}

let clientLogoutRequest: null | Promise<any> = null;

const request = async <TResponse>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  options?: CustomOptions | undefined
): Promise<{status: number; payload: TResponse}> => {
  /**
   * Nếu không truyền baseUrl hoặc baseUrl = undefined thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
   * Nếu truyền baseUrl thì lấy từ baseUrl, truyền vào rỗng thì đồng nghĩa với việc gọi api đến next server
   */
  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  let fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : `${baseUrl}/${url}`;

  if (options?.params) {
    const queryString = new URLSearchParams(options.params as any).toString();
    fullUrl += `?${queryString}`;
  }
  // fullUrl = http://localhost:4004/users?limit=5&page=1

  let body: FormData | string | undefined = undefined;

  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }

  const baseHeaders: {
    [key: string]: string;
  } = body instanceof FormData ? {} : {"Content-Type": "application/json"};

  if (isClient) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    method,
    body,
  });

  const payload: TResponse = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  // Interceptor
  if (!res.ok) {
    if (res.status === IStatus.UNPROCESSABLE_ENTITY) {
      const dataError: IDataError = {
        errorCode: "unique.ValidatorInvalid",
        errorMessage: "Lỗi validate",
      };
      displayError(dataError);
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === IStatus.UNAUTHORIZED) {
      if (typeof window !== undefined) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({force: true}),
            headers: {
              ...baseHeaders,
            } as any,
          });
          try {
            await clientLogoutRequest;
          } catch (error) {
          } finally {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            localStorage.removeItem(ACCESS_TOKEN_EXPIRED);
            localStorage.removeItem(PROFILE);
            clientLogoutRequest = null;
            location.href = "/login";
          }
        } else {
          redirect(`/login`);
        }
      }
    } else if (res.status === IStatus.ERROR) {
      toast({
        title: "Lỗi 400",
        description: (data.payload as any).message || "Xóa thất bại",
        duration: 3000,
        variant: "destructive",
      });
      throw data;
    } else {
      toast({
        title: `Lỗi ${res.status}`,
        description: (data.payload as any).message || "Thực hiện thất bại",
        duration: 3000,
        variant: "destructive",
      });
      throw new HttpError(data);
    }
  }
  if (data.payload === undefined) {
    const dataEmpty: IDataError = {
      errorCode: "ERROR???",
      errorMessage: "Data is empty",
    };
    displayError(dataEmpty);
    throw new HttpError({status: IStatus.SUCCESS, payload: dataEmpty});
  }
  return data;
};

const http = {
  get<TResponse>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("GET", url, options);
  },
  post<TResponse>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("POST", url, {...options, body});
  },
  put<TResponse>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("PUT", url, {...options, body});
  },
  patch<TResponse>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("PATCH", url, {...options, body});
  },
  delete<TResponse>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<TResponse>("DELETE", url, {...options});
  },
};

export default http;
