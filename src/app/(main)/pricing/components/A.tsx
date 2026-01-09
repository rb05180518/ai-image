import React, { PropsWithChildren } from "react";

export default function A(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div>
      A{/* <hr /> */}
      传递过来的内容
      {children}
    </div>
  );
}
