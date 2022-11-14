import { Tab, TabList } from "@chakra-ui/react";
import React from "react";
import theme from "../../theme";

interface TabHeadingsProps {
  username: string;
  isMe: boolean;
}

export const TabHeadings: React.FC<TabHeadingsProps> = ({ username, isMe }) => {
  const tabLabels = ["Created", "Completed", "Ongoing", "Appeals"];

  return (
    <TabList
      bgColor={isMe ? theme.colors.lightPurple : null}
      borderRadius={4}
      overflow="scroll"
      mt={5}
    >
      {isMe ? (
        <>
          {tabLabels.map((label) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </>
      ) : (
        <Tab>{username}'s Collections</Tab>
      )}
    </TabList>
  );
};
