const cron = require("node-cron");
const { request } = require("graphql-request");

const insertMostVotesUsersQuery = `
mutation insertMostVotesUsers {
  insertMostVotesUsers
}
`;

const insertMostGuessesUsers = `
mutation insertMostGuessesUsers {
  insertMostGuessesUsers
}
`;

cron.schedule("0 0 * * *", () => {
  return request(process.env.API_URL, insertMostVotesUsersQuery);
});

cron.schedule("2 0 * * *", () => {
  return request(process.env.API_URL, insertMostGuessesUsers);
});
