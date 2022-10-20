import { Badge } from "@chakra-ui/react";
import React from "react";
import { Appeal } from "../../generated/graphql";
import { AppealsItem } from "./AppealsItem";

interface AppealsSubmittedItemProps {
  appeal: Appeal;
}

export const AppealsSubmittedItem: React.FC<AppealsSubmittedItemProps> = ({
  appeal,
}) => {
  return (
    <AppealsItem
      appeal={appeal}
      children={
        <Badge
          ml={1}
          color={
            appeal.state === "pending"
              ? "orange"
              : appeal.state === "approved"
              ? "green"
              : "red"
          }
          bgColor="transparent"
        >
          {appeal.state}
        </Badge>
      }
    />
  );
};
