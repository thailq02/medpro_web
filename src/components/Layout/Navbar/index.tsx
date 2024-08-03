import apiCategoryRequest, {
  ICategoryBody,
  IGetListCategoryRes,
} from "@/apiRequest/ApiCategory";
import {CATE, QUERY_PARAMS} from "@/apiRequest/common";
import UserStatus from "@/components/Layout/Navbar/UserStatus";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {TriangleDownIcon} from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.scss";

export type CategoryMap = {
  [key: string]: ICategoryBody & {children: ICategoryBody[]; icon: string};
};

export default async function Navbar() {
  let data: IGetListCategoryRes["data"] | null = null;
  try {
    const result = await apiCategoryRequest.getListCategory(QUERY_PARAMS);
    data = result.payload.data;
  } catch (error) {
    data = [];
  }

  const categoryData = (): CategoryMap => {
    const categoryMap: CategoryMap = {};
    data?.forEach((category) => {
      if (category.parent_id === null) {
        let icon = "";
        switch (category.slug) {
          case CATE.CSYT:
            icon = "/tablet/CSYT.svg";
            break;
          case CATE.DVYT:
            icon = "/tablet/DVYT.svg";
            break;
          case CATE.KSKDN:
            icon = "/tablet/DVYT.svg";
            break;
          case CATE.TINTUC:
            icon = "/tablet/TinTuc.svg";
            break;
          case CATE.HUONGDAN:
            icon = "/tablet/HuongDan.svg";
            break;
          case CATE.LHHT:
            icon = "/tablet/Contact.svg";
            break;
          default:
            icon = "/tablet/CSYT.svg";
            break;
        }
        categoryMap[category._id] = {
          ...category,
          children: [],
          icon,
        };
      } else {
        if (category.parent_id in categoryMap) {
          categoryMap[category.parent_id].children.push(category);
        }
      }
    });
    return categoryMap;
  };

  return (
    <nav className={styles.container}>
      <div className={styles.left}>
        <Link href="/" className="block w-[130px]">
          <Image
            src="/img/logo.png"
            alt="Medpro Logo"
            width={500}
            height={500}
            className="size-full object-contain"
          />
        </Link>
        <Menubar className={styles.nav}>
          {Object.values(categoryData()).map((category) => (
            <MenubarMenu key={category.name}>
              <MenubarTrigger>
                <Link
                  href={
                    category.slug === CATE.DVYT
                      ? "#"
                      : category.slug === CATE.CSYT
                      ? `/${CATE.CSYT}`
                      : `/${category.slug}`
                  }
                >
                  {category.name}
                </Link>
                {!!category.children.length && <TriangleDownIcon />}
              </MenubarTrigger>
              {!!category.children.length && (
                <MenubarContent className="cursor-pointer relative z-[999]">
                  {category.children.map((child: ICategoryBody) => (
                    <MenubarItem
                      key={child.name}
                      className="p-2 cursor-pointer hover:!text-textSecondary hover:!bg-[#e6f2ff] text-[13px] font-medium"
                    >
                      <Link
                        className="block w-full"
                        href={`/${category.slug}/${child.slug}`}
                      >
                        {child.name}
                      </Link>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              )}
            </MenubarMenu>
          ))}
        </Menubar>
      </div>
      <UserStatus categoryData={categoryData()} />
    </nav>
  );
}
