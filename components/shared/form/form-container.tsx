"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormActionState, FormContainerProps } from "@/types";

const initialState: FormActionState = {
  message: "",
  success: false,
  redirectTo: "",
};

const FormContainer = ({ action, children, className }: FormContainerProps) => {
  const router = useRouter();

  const [state, formAction] = React.useActionState<FormActionState>(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    action as any,
    initialState
  );

  useEffect(() => {
    if (state?.message) toast(state.message);
    if (state?.success && state?.redirectTo) router.replace(state.redirectTo);
  }, [state, router]);

  return (
    <form className={className} action={formAction}>
      {typeof children === "function" ? children(state) : children}
    </form>
  );
};

export default FormContainer;
