import { Flex } from "@chakra-ui/react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { CollectionEntrySnippetFragment } from "../../generated/graphql";
import { CorrectGuessItem } from "../../utils/CorrectGuessItemProps";
import { CorrectGuess } from "./CorrectGuess";
import { NotGuessed } from "./NotGuessed";
// import { useSpring, animated } from "@react-spring/web"; // uninstall?

type EntryProps = {
  entry: CollectionEntrySnippetFragment;
  isMe: boolean;
  measuredRef: any;
  correctGuesses: CorrectGuessItem[];
  // correctGuessesLocal: CorrectGuessLocal[];
};

export const Entry: React.FC<EntryProps> = ({
  entry,
  isMe,
  measuredRef,
  correctGuesses,
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (correctGuesses.map((g) => g.externalId).includes(entry.externalId)) {
      setRevealed(true);
    }
  }, [correctGuesses]);

  // let clickHandler = () => setRevealed((prevRevealed) => !prevRevealed);

  return (
    // <Flex id={entry.id.toString()}>
    <AnimateSharedLayout type="crossfade">
      <AnimatePresence exitBeforeEnter>
        <EntryCard
          key={`${entry.id}-${revealed}`}
          cardId={entry.id.toString()}
          // clickHandler={clickHandler}
          revealed={revealed}
          entry={entry}
          isMe={isMe}
          measuredRef={measuredRef}
          correctGuesses={correctGuesses}
        />
      </AnimatePresence>
    </AnimateSharedLayout>
    // </Flex>
  );
};

type EntryCardProps = EntryProps & {
  cardId: string;
  // clickHandler: any;
  revealed: boolean;
};

const EntryCard: React.FC<EntryCardProps> = ({
  cardId,
  // clickHandler,
  revealed,
  entry,
  isMe,
  measuredRef,
}) => {
  let cardProps = {
    layoutId: cardId,
    id: cardId,
    // className: "card",
    // onClick: clickHandler,
  };
  let animationProps = {
    initial: { y: 5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0, transition: { duration: 1 } },
    transition: { duration: 0.5 },
  };

  let body = null;
  if (isMe || revealed) {
    body = <CorrectGuess entry={entry} isMe={isMe} measuredRef={measuredRef} />;
  } else {
    body = <NotGuessed />;
  }
  return (
    <motion.div {...cardProps} {...animationProps}>
      <Flex w={40} minH={44} marginY={2} justify="center" key={cardId}>
        {body}
      </Flex>
    </motion.div>
  );
};
