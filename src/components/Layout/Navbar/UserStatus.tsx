"use client";
import apiAuthRequest from "@/apiRequest/ApiAuth";
import {ICategoryBody} from "@/apiRequest/ApiCategory";
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED,
  PROFILE,
  REFRESH_TOKEN,
  VerifyStatus,
} from "@/apiRequest/common";
import {AppContext} from "@/app/(home)/AppProvider";
import {CategoryMap} from "@/components/Layout/Navbar";
import {ModalConfirmCustom} from "@/components/ModalComfirm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {useToast} from "@/components/ui/use-toast";
import {
  ChatBubbleIcon,
  ExitIcon,
  HamburgerMenuIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useContext, useState} from "react";
import styles from "./Navbar.module.scss";
const AccountManagement = dynamic(() => import("@/module/account-management"), {
  ssr: false,
});

interface UserStatusProps {
  categoryData: CategoryMap;
}

export default function UserStatus({categoryData}: UserStatusProps) {
  const {user} = useContext(AppContext);
  const [isModalAccountOpen, setIsModalAccountOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isCloseSheet, setIsCloseSheet] = useState(false);
  const router = useRouter();
  const {toast} = useToast();

  const handleLogout = async () => {
    try {
      await apiAuthRequest.logoutFromNextClientToNextServer();

      toast({
        title: "Thành công",
        description: "Đăng xuất thành công",
        duration: 3000,
      });
      router.push("/");
    } catch (error) {
      await apiAuthRequest
        .logoutFromNextClientToNextServer(true)
        .then(() => router.push("/"));
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.removeItem(ACCESS_TOKEN_EXPIRED);
        localStorage.removeItem(PROFILE);
      }
      window.location.reload();
    }
  };
  return (
    <div className={styles.right}>
      {!Boolean(user) ? (
        <Button
          className={styles.btnLogin}
          onClick={() => router.push("/login")}
        >
          <PersonIcon className="mr-2 size-4" />
          Tài khoản
        </Button>
      ) : (
        <>
          <AccountManagement
            isOpen={isModalAccountOpen}
            setIsOpen={setIsModalAccountOpen}
          />
          <ModalConfirmCustom
            isOpen={isModalConfirmOpen}
            setIsOpen={setIsModalConfirmOpen}
            title={"Đăng xuất"}
            content={"Bạn có chắc chắn muốn đăng xuất?"}
            handleOke={handleLogout}
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={`cursor-pointer ${styles.avatar}`}
            >
              <Avatar>
                <AvatarImage src={user?.avatar} alt="Avatar" />
                <AvatarFallback>
                  <Image
                    src="/img/avatar/avatar.jpg"
                    alt="Avatar"
                    width={500}
                    height={500}
                  />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46 z-[99999999]">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsModalAccountOpen(true)}
              >
                <PersonIcon className="mr-2 size-4" />
                Quản lý tài khoản
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user && user?.verify === VerifyStatus.VERIFIED && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/chat")}
                  >
                    <ChatBubbleIcon className="mr-2 size-4" />
                    Tin nhắn
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsModalConfirmOpen(true)}
              >
                <ExitIcon className="mr-2 size-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      {/* NAV for TABLET */}
      <div className={styles.tablet}>
        <Sheet open={isCloseSheet} onOpenChange={setIsCloseSheet}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="bg-transparent outline-none border-none shadow-none"
            >
              <HamburgerMenuIcon className="size-7" />
            </Button>
          </SheetTrigger>
          <SheetContent className={styles.navTablet}>
            <SheetHeader className="py-[10px] px-4 border border-b-slate-300">
              <Link href="/" className="block w-[130px]">
                <Image
                  src="/img/logo.png"
                  alt="Medpro Logo"
                  width={500}
                  height={500}
                  className="size-full object-contain"
                />
              </Link>
            </SheetHeader>
            <div className="p-4">
              {!user && (
                <>
                  <Button className="w-[calc(50%-5px)] mr-1" asChild>
                    <Link href="/register">Đăng ký</Link>
                  </Button>
                  <Button className="w-[calc(50%-5px)] ml-1" asChild>
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                </>
              )}
              <div>
                <Accordion type="single" collapsible className="w-full">
                  {Object.values(categoryData).map((cate, index) => (
                    <AccordionItem value={`"item-"${index}`} key={index}>
                      <AccordionTrigger className={styles.accordionTrigger}>
                        <div className="w-[24px] h-[18px]">
                          <Image
                            src={cate.icon}
                            width={50}
                            height={50}
                            alt={cate.name}
                            className="size-full object-contain"
                          />
                        </div>
                        <Link
                          className="font-semibold text-base"
                          href={`/${cate.slug}`}
                          onClick={() => setIsCloseSheet(false)}
                        >
                          {cate.name}
                        </Link>
                      </AccordionTrigger>
                      {!!cate.children.length && (
                        <AccordionContent>
                          {cate.children?.map((child: ICategoryBody) => (
                            <div
                              key={child._id}
                              className="py-2 px-5 font-medium border-b border-slate-300 last:border-none last:pb-0"
                            >
                              <Link
                                href={`/${cate.slug}/${child.slug}`}
                                onClick={() => setIsCloseSheet(false)}
                              >
                                {child.name}
                              </Link>
                            </div>
                          ))}
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
