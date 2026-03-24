import {Filter} from "bad-words";
import leoProfanity from "leo-profanity";

const badWordFilter = new Filter();

// Custom banned words.
const customBannedWords = [
  "kill",
  "murder",
  "stab",
  "shoot",
  "bomb",
  "attack",
  "assault",
  "weapon",
  "gun",
  "knife",
  "suicide",
  "death"
];

// Add to leo filter
leoProfanity.add(customBannedWords);

// Optional: normalize text (helps catch bypass attempts)
const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ""); // remove symbols

export function validateText(input) {
  const value = normalize(input.trim());

  if (!value) {
    return "Field cannot be empty.";
  }

  if (badWordFilter.isProfane(value)) {
    return "Inappropriate language is not allowed.";
  }

  if (leoProfanity.check(value)) {
    return "Violent or unsafe language is not allowed.";
  }

  return "";
}