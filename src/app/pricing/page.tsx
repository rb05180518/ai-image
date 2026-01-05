import type { PropsWithChildren } from "react";
import styles from "./style.module.css";
import A from "./components/A";

import B from "./components/B";

const Pricing = (props: PropsWithChildren) => {
  return (
    <div className={styles.title}>
      Pricing页面
      <span className={styles.ss}>1111</span>
      <hr />
      <A>
        <B />
      </A>
    </div>
  );
};

export default Pricing;
