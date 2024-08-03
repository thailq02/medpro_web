import {SpinnerIcon} from "@/components/Icon";
import {Button, ButtonProps} from "@/components/ui/button";
import Link from "next/link";
import {twMerge} from "tailwind-merge";
import styles from "./Button.module.scss";

interface IButtonProps extends ButtonProps {
  title: string;
  href?: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ButtonGlobal({
  title,
  href = "#",
  className,
  onClick,
  ...props
}: IButtonProps) {
  const buttonClasses = twMerge(styles.btnGlobal, className);
  if (onClick) {
    return (
      <Button className={buttonClasses} onClick={onClick} {...props}>
        {title}
      </Button>
    );
  }
  return (
    <Button className={buttonClasses} asChild {...props}>
      <Link href={href}>{title}</Link>
    </Button>
  );
}

export function ButtonViewDetail({
  title,
  href = "#",
  className,
  ...props
}: IButtonProps) {
  return (
    <Button
      className={twMerge(styles.btnViewDetail, className)}
      asChild
      {...props}
    >
      <Link href={href}>{title}</Link>
    </Button>
  );
}

export function ButtonSubmit({
  title,
  className,
  classNameLoading,
  loading,
  onClick,
  ...props
}: IButtonProps & {classNameLoading?: string}) {
  return (
    <Button
      type="submit"
      disabled={props.disabled}
      className={className}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <SpinnerIcon
          className={twMerge("mr-2 size-4 animate-spin", classNameLoading)}
        />
      )}
      {title}
    </Button>
  );
}
