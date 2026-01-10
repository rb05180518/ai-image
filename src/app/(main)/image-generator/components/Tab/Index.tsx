"use client";

import { Tabs } from "antd";
import type { TabsProps } from "antd";
import styles from "./Index.module.css";

interface TabItem {
  key: string;
  label: string;
}

interface TabComponentProps {
  items?: TabItem[];
  activeKey?: string;
  onChange?: (key: string) => void;
}

const TabComponent = ({
  items = [
    { key: "1", label: "My Creations" },
    { key: "2", label: "Explore Interesting Creations" },
  ],
  activeKey,
  onChange,
}: TabComponentProps) => {
  const tabItems: TabsProps["items"] = items.map((item) => ({
    key: item.key,
    label: item.label,
  }));

  return (
    <div className={"max-w-360 mt-18 mx-auto w-full"}>
      <div className={styles.tabWrapper}>
        <Tabs activeKey={activeKey} items={tabItems} onChange={onChange} />
      </div>
    </div>
  );
};

export default TabComponent;
