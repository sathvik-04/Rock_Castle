"use client";

import { AnimationOptions, motion } from "motion/react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface SlideUpTextProps {
  children: React.ReactNode;
  split?: "words" | "characters" | "lines";
  delay?: number;
  stagger?: number;
  from?: "first" | "last" | "center";
  transition?: AnimationOptions;
  className?: string;
  wordClass?: string;
  charClass?: string;
  autoStart?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
  inView?: boolean;
  once?: boolean;
}

export interface SlideUpTextRef {
  startAnimation: () => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

const SlideUpText = forwardRef<SlideUpTextRef, SlideUpTextProps>(
  (
    {
      children,
      split = "words",
      delay = 0,
      stagger = 0.04,
      from = "first",
      transition = {
        type: "tween",
        ease: [0.625, 0.05, 0, 1],
        duration: 0.7,
      },
      className,
      wordClass,
      charClass,
      autoStart = true,
      onStart,
      onComplete,
      inView = false,
      once = true,
      ...props
    },
    ref,
  ) => {
    const text =
      typeof children === "string" ? children : children?.toString() || "";
    const [isAnimating, setIsAnimating] = useState(false);

    const [animationDone, setAnimationDone] = useState(false);

    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text), ({ segment }) => segment);
      }
      return Array.from(text);
    };

    const elements = useMemo(() => {
      const words = text.split(" ");
      if (split === "characters") {
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      return split === "words" ? text.split(" ") : text.split("\n");
    }, [text, split]);

    const getStaggerDelay = useCallback(
      (index: number) => {
        const total =
          split === "characters"
            ? elements.reduce(
              (acc, word) =>
                acc +
                (typeof word === "string"
                  ? 1
                  : word.characters.length + (word.needsSpace ? 1 : 0)),
              0,
            )
            : elements.length;

        if (from === "first") return index * stagger;
        if (from === "last") return (total - 1 - index) * stagger;
        if (from === "center") {
          const center = Math.floor(total / 2);
          return Math.abs(center - index) * stagger;
        }
        return index * stagger;
      },
      [elements, from, stagger, split],
    );

    const startAnimation = useCallback(() => {
      setIsAnimating(true);
      onStart?.();
    }, [onStart]);

    useImperativeHandle(ref, () => ({
      startAnimation,
      reset: () => {
        setIsAnimating(false);
        setAnimationDone(false);
      },
    }));

    useEffect(() => {
      if (autoStart && !inView) {
        startAnimation();
      }
    }, [autoStart, inView, startAnimation]);

    const variants = {
      hidden: { y: "100%" },
      visible: (i: number) => ({
        y: 0,
        transition: {
          ...transition,
          delay:
            delay + ((transition?.delay as number) || 0) + getStaggerDelay(i),
        },
      }),
    };

    const clipBoxStyle: React.CSSProperties = {
      paddingTop: "0.14em",
      paddingBottom: "0.04em",
      marginTop: "-0.14em",
      marginBottom: "-0.04em",
      overflow: animationDone ? "visible" : "hidden",
    };

    return (
      <motion.span
        className={cn(
          className,
          "flex flex-wrap whitespace-pre-wrap",
          split === "lines" && "flex-col",
        )}
        initial="hidden"
        whileInView={inView ? "visible" : undefined}
        animate={inView ? undefined : isAnimating ? "visible" : "hidden"}
        viewport={{ once }}
        onAnimationStart={() => {
          if (inView) {
            setIsAnimating(true);
            onStart?.();
          }
        }}
        {...props}
      >
        <span className="sr-only">{text}</span>

        {(split === "characters"
          ? (elements as WordObject[])
          : (elements as string[]).map((el, i, arr) => ({
            characters: [el],
            needsSpace: split === "words" && i !== arr.length - 1,
          }))
        ).map((wordObj, wordIndex, array) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0);

          return (
            <span
              key={wordIndex}
              aria-hidden="true"
              style={clipBoxStyle}
              className={cn("inline-flex", wordClass)}
            >
              {wordObj.characters.map((char, charIndex) => (
                <span
                  className={cn(
                    charClass,
                    "whitespace-pre-wrap relative",
                  )}
                  style={clipBoxStyle}
                  key={charIndex}
                >
                  <motion.span
                    custom={previousCharsCount + charIndex}
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={variants}
                    onAnimationComplete={
                      wordIndex === array.length - 1 &&
                        charIndex === wordObj.characters.length - 1
                        ? () => {
                            setAnimationDone(true);
                            onComplete?.();
                          }
                        : undefined
                    }
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
              {wordObj.needsSpace && (
                <span
                  className="relative"
                  style={clipBoxStyle}
                >
                  <motion.span
                    custom={previousCharsCount + wordObj.characters.length}
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={variants}
                    className="inline-block"
                  >
                    {" "}
                  </motion.span>
                </span>
              )}
            </span>
          );
        })}
      </motion.span>
    );
  },
);

SlideUpText.displayName = "SlideUpText";

export { SlideUpText };
export type { SlideUpTextProps };

export default SlideUpText;
