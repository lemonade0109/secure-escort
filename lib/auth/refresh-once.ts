"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

const RefreshOnce = ({ flag = "signedOut" }: { flag?: string }) => {
  const params = useSearchParams();

  React.useEffect(() => {
    if (params.get(flag) === "1") {
      window.location.replace("/");
    }
  }, [params, flag]);
};

export default RefreshOnce;
