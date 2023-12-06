import * as React from "react";
import type { ICandAProps } from "./ICandAProps";

import { Container, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

export const CandA: React.FC<ICandAProps> = (props) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <Container>
          <div className="fixed-container">stick me</div>
          <div className="scroll-container">
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll scroll scroll scroll
            scroll scroll scroll scroll scroll scroll
          </div>
        </Container>
      </NotificationsProvider>
    </MantineProvider>
  );
};
