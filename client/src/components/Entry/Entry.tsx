import { Flex } from "@chakra-ui/react";
import { useSpring } from "@react-spring/web";
import React, { useEffect, useState } from "react";
import {
  CollectionEntry,
  CollectionEntryInput,
  MyCorrectGuessesQuery,
} from "../../generated/graphql";
import { CorrectGuess } from "./CorrectGuess";
import { NotGuessed } from "./NotGuessed";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { CorrectGuessItem } from "../../utils/CorrectGuessItemProps";
// import { useSpring, animated } from "@react-spring/web"; // uninstall?

type EntryProps = {
  entry: Omit<CollectionEntry, "collection" | "collectionId">;
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
  correctGuesses,
}) => {
  let cardProps = {
    layoutId: cardId,
    id: cardId,
    // className: "card",
    // onClick: clickHandler,
  };
  let animationProps = {
    // // initial: { rotateY: 180 },
    // animate: { opacity: 1 },
    // exit: { rotateY: 180, opacity: 0 },
    // transition: { duration: 0.5 },
    initial: { y: 5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0, transition: { duration: 1 } },
    transition: { duration: 0.5 },
  };
  return (
    <motion.div {...cardProps} {...animationProps}>
      <Flex w={40} minH={44} marginY={2} justify="center" key={cardId}>
        {isMe || revealed ? (
          <CorrectGuess entry={entry} isMe={isMe} measuredRef={measuredRef} />
        ) : (
          <NotGuessed />
        )}
      </Flex>
    </motion.div>
  );
};
