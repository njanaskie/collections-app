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

const insertMostCreatedCollectionsUsers = `
mutation insertMostCreatedCollectionsUsers {
  insertMostCreatedCollectionsUsers
}
`;

const insertMostCompletedCollectionsUsers = `
mutation insertMostCompletedCollectionsUsers {
  insertMostCompletedCollectionsUsers
}
`;

cron.schedule("0 0 * * *", () => {
  return request(process.env.API_URL, insertMostVotesUsersQuery);
});

cron.schedule("2 0 * * *", () => {
  return request(process.env.API_URL, insertMostGuessesUsers);
});

cron.schedule("4 0 * * *", () => {
  return request(process.env.API_URL, insertMostCreatedCollectionsUsers);
});

cron.schedule("6 0 * * *", () => {
  return request(process.env.API_URL, insertMostCompletedCollectionsUsers);
});
