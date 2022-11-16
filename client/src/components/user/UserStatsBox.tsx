import { Flex, Stat, StatLabel, StatNumber, Tooltip } from "@chakra-ui/react";
import React from "react";
import theme from "../../theme";
import { UserStatsProps } from "./BoxContent";

interface UserStatsBoxProps {
  userStats: UserStatsProps;
  username: string;
}

export const UserStatsBox: React.FC<UserStatsBoxProps> = ({
  userStats,
  username,
}) => {
  return (
    <Flex
      bg={"whiteAlpha.400"}
      color={theme.colors.superLightBlue}
      p={2}
      borderRadius={10}
      justify="center"
      shadow="sm"
      // wrap="wrap"
      // direction={"column"}
      flexGrow={1}
    >
      <Flex direction={["column", "column", "row"]}>
        <Tooltip
          label={`${username} has created ${userStats.created} ${
            userStats.created === 1 ? "collection" : "collections"
          }`}
          fontSize="sm"
          placement="bottom"
        >
          <Stat m={2}>
            <StatLabel>Created</StatLabel>
            <StatNumber>{userStats.created || "-"}</StatNumber>
          </Stat>
        </Tooltip>

        <Tooltip
          label={`${username} has completed ${userStats.completed} ${
            userStats.completed === 1 ? "collection" : "collections"
          }`}
          fontSize="sm"
          placement="bottom"
        >
          <Stat m={2}>
            <StatLabel>Completed</StatLabel>
            <StatNumber>{userStats.completed || "-"}</StatNumber>
          </Stat>
        </Tooltip>
        <Tooltip
          label={`${username} has ${userStats.started} in-progress ${
            userStats.started === 1 ? "collection" : "collections"
          }`}
          fontSize="sm"
          placement="bottom"
        >
          <Stat m={2}>
            <StatLabel>Ongoing</StatLabel>
            <StatNumber>{userStats.started || "-"}</StatNumber>
          </Stat>
        </Tooltip>
      </Flex>

      <Flex direction={["column", "column", "row"]}>
        <Tooltip
          label={`${username} has made a total of ${
            userStats.guesses
          } correct ${userStats.guesses === 1 ? "guess" : "guesses"}`}
          fontSize="sm"
          placement="bottom"
        >
          <Stat m={2}>
            <StatLabel>Guesses</StatLabel>
            <StatNumber>{userStats.guesses || "-"}</StatNumber>
          </Stat>
        </Tooltip>

        <Tooltip
          label={`${username} has received a total of ${userStats.likes} ${
            userStats.likes === 1 ? "like" : "likes"
          }`}
          fontSize="sm"
          placement="bottom"
        >
          <Stat m={2}>
            <StatLabel>Likes</StatLabel>
            <StatNumber>{userStats.likes || "-"}</StatNumber>
          </Stat>
        </Tooltip>
      </Flex>
    </Flex>
  );
};
