import {ENTITY_ERROR_STATUS, EntityError, IDataError} from "@/apiRequest/http";
import {toast} from "@/components/ui/use-toast";
import {UseFormSetError} from "react-hook-form";

const ListErrorMessage = [
  {
    error_code: "unique.ValidatorInvalid",
    description: "Lỗi validate",
  },
];

export default function displayError(dataError: IDataError): void {
  const {errorCode} = dataError;

  const error = ListErrorMessage.find((item) => item.error_code === errorCode);
  let errorMessage;
  if (error) {
    errorMessage = error.description;
  } else {
    errorMessage = dataError.errorMessage ?? "Somethings Wrong";
  }
  if (typeof window !== "undefined") {
    toast({
      title: "Something is wrong. Please try again",
      description: errorMessage,
      duration: 3000,
      variant: "destructive",
    });
  }
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    const errors = error.payload.errors as {
      [key: string]: {
        msg: string | {message: string; status: number};
        path: string;
        [key: string]: any;
      };
    };
    const status = error.status as number;
    if (status === ENTITY_ERROR_STATUS) {
      Object.keys(errors).forEach((key) => {
        const errorDetail = errors[key];
        setError(key, {
          type: "server",
          message:
            typeof errorDetail.msg === "string"
              ? errorDetail.msg
              : errorDetail.msg.message,
        });
      });
    }
  } else {
    throw error;
    toast({
      title: "Lỗi khác 422",
      description: error.payload.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};
