"use client";
import {CircleUserIcon, SecurityIcon} from "@/components/Icon";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CalendarIcon} from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import styles from "./Account.module.scss";
const AppointmentForm = dynamic(
  () => import("@/module/account-management/appointments"),
  {ssr: false}
);
const SecurityForm = dynamic(
  () => import("@/module/account-management/security"),
  {ssr: false}
);
const UpdateMeForm = dynamic(
  () => import("@/module/account-management/update-me"),
  {ssr: false}
);

export default function AccountManagement({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={styles.dialogContent}>
        <Tabs defaultValue="account" className={styles.tabContainer}>
          <TabsList className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>Tài khoản</h2>
            <p className={styles.sidebarDesc}>Quản lý thông tin tài khoản</p>
            <TabsTrigger
              value="account"
              className={`${styles.sidebarItem} mt-5`}
            >
              <CircleUserIcon className="size-5" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger value="security" className={styles.sidebarItem}>
              <SecurityIcon className="size-5" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="appointment" className={styles.sidebarItem}>
              <CalendarIcon className="size-5" />
              Lịch khám
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className={styles.tabContent}>
            <UpdateMeForm />
          </TabsContent>
          <TabsContent value="security" className={styles.tabContent}>
            <SecurityForm />
          </TabsContent>
          <TabsContent value="appointment" className={styles.tabContent}>
            <AppointmentForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
