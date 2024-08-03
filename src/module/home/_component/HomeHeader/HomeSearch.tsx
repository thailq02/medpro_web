"use client";
import {Input} from "@/components/ui/input";
import {MagnifyingGlassIcon} from "@radix-ui/react-icons";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import React from "react";
import {useDebouncedCallback} from "use-debounce";
import styles from "./HomeHeader.module.scss";

export default function HomeSearch({placeholder}: {placeholder: string}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  const debounced = useDebouncedCallback(onChange, 300);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams);
    if (e.target.value !== "") {
      params.set("search_key", e.target.value);
    } else {
      params.delete("search_key");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={styles.searchInput}>
      <MagnifyingGlassIcon className="size-6 ml-3" />
      <div className="w-full relative">
        <Input
          type="search"
          placeholder={""}
          className="home-header_search"
          onChange={(e) => debounced(e)}
          defaultValue={searchParams.get("search_key")?.toString()}
        />
        <label className={styles.placeholder}>{placeholder}</label>
      </div>
    </div>
  );
}
