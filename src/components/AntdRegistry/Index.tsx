"use client";

import React from "react";
import { AntdRegistry as AntdRegistryProvider } from "@ant-design/nextjs-registry";

export default function AntdRegistry({ children }: React.PropsWithChildren) {
  return <AntdRegistryProvider>{children}</AntdRegistryProvider>;
}
