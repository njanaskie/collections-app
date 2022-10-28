import { UserAttributesInput } from "../resolvers/UserAttributesInput";

function validURL(str: string) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

export const validateUpdateUser = (attributes: UserAttributesInput) => {
  if (attributes.bio && attributes.bio.length >= 280) {
    return [
      {
        field: "bio",
        message: "Bio cannot be more than 280 characters",
      },
    ];
  }

  if (attributes.letterboxd_url && !validURL(attributes.letterboxd_url)) {
    return [
      {
        field: "letterboxd_url",
        message: "Not a valid URL",
      },
    ];
  }

  if (attributes.twitter_url && !validURL(attributes.twitter_url)) {
    return [
      {
        field: "twitter_url",
        message: "Not a valid URL",
      },
    ];
  }

  if (attributes.website_url && !validURL(attributes.website_url)) {
    return [
      {
        field: "website_url",
        message: "Not a valid URL",
      },
    ];
  }

  if (!attributes.email) {
    return [
      {
        field: "email",
        message: "Need an email",
      },
    ];
  }

  if (!attributes.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }

  return null;
};
