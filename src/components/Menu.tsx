"use client";

import { Tabs } from "@geist-ui/react";
import { usePathname, useRouter  } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter(); // Next.js App Router navigation

  return (
    <Tabs
      value={pathname}
      hideDivider
      onChange={(val) => {
        router.push(val);
      }}
    >
      <Tabs.Item label="Home" value="/" />
      <Tabs.Item label="KD" value="/kd" />
      <Tabs.Item label="Calendar" value="/calendar" />
    </Tabs>
  );
}
