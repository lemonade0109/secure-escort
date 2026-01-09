"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormActionState, FormContainerProps } from "@/types";

const initialState: FormActionState = {
  message: "",
  success: false,
  redirectTo: "",
};

const FormContainer = ({
  action,
  children,
  className,
  onReset,
}: FormContainerProps) => {
  const router = useRouter();
  const last = React.useRef<{ msg?: string; to?: string }>({});

  const [state, formAction] = React.useActionState<FormActionState>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action as any,
    initialState
  );

  React.useEffect(() => {
    const msg = state?.message?.trim();
    const to = state?.redirectTo;

    if (msg && last.current.msg !== msg) {
      toast(msg);
      last.current.msg = msg;
    }

    if (state?.success && to && last.current.to !== to) {
      last.current.to = to;
      router.replace(to);
    }
  }, [state, router]);

  return (
    <form className={className} action={formAction} onReset={onReset}>
      {typeof children === "function"
        ? (children as (state: FormActionState) => React.ReactNode)(state)
        : children}
    </form>
  );
};

export default FormContainer;
