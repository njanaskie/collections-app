import {
  Link,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import theme from "../../theme";

interface TableProps {
  caption: string;
  tableHeaders: string[];
  data: any;
}

export const StatTable: React.FC<TableProps> = ({
  caption,
  tableHeaders,
  data,
}) => {
  return (
    <TableContainer mb={10}>
      <Table>
        <TableCaption color="gray.200" fontFamily="monospace">
          {caption}
        </TableCaption>
        <Thead>
          <Tr>
            {tableHeaders.map((h: string) => (
              <Th key={h} color="gray.600">
                {h}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((u: any) => (
            <Tr key={u.userId} _hover={{ bgColor: theme.colors.darkBlue }}>
              <NextLink
                href={{
                  pathname: "/user/[username]",
                  query: { id: u.userId },
                }}
                as={`/user/${u.user.username}`}
              >
                <Td>
                  <Link _hover={{ textColor: theme.colors.lightOrange }}>
                    {u.user.username}
                  </Link>
                </Td>
              </NextLink>
              <Td>{u.stat}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
