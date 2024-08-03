"use client";
import {VerifyStatus} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {CameraIcon} from "@/components/Icon";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toBase64} from "@/lib/utils";
import Image from "next/image";
import {useContext, useRef, useState} from "react";
import styles from "./AvatarUpload.module.scss";

type AvatarUploadProps = {
  value?: string | File;
  onChange?: (value?: File | File[]) => void;
};
const IMAGE_FORMATS_ACCEPTED = ["image/jpg", "image/jpeg", "image/png"];

export function AvatarUpload({value, onChange}: AvatarUploadProps) {
  const {user} = useContext(AppContext);
  const isFile = value instanceof File ? "" : (value as string);
  const [url, setUrl] = useState<string>(isFile);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const base64 = (await toBase64(file)) as string;
      setUrl(base64);
      onChange?.(file);
    }
  };
  return (
    <div className={styles.container}>
      <Avatar className="size-full">
        <AvatarImage src={url ? url : isFile} className="object-cover" />
        <AvatarFallback className="bg-secondary">
          <Image
            src="/img/avatar/avatar.jpg"
            alt="Avatar"
            width={500}
            height={500}
          />
        </AvatarFallback>
      </Avatar>
      {user?.verify === VerifyStatus.VERIFIED && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={styles.btn}
            onClick={(e) => {
              e.preventDefault();
              inputRef.current?.click();
            }}
          >
            <CameraIcon className="size-5" />
          </Button>
          <Input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={IMAGE_FORMATS_ACCEPTED.join(",")}
          />
        </>
      )}
    </div>
  );
}
