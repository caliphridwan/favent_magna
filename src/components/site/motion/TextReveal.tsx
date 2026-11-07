"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  /** Highlight the last word in lime. */
  accentLast?: boolean;
  className?: string;
  delay?: number;
};

/** Reveals a headline word by word: each word rises out of a mask with a soft blur. */
export function TextReveal({ text, accentLast, className, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  const words = text.trim().split(/\s+/);

  return (
    <motion.h1 className={className} aria-label={text} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
        <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={cn("inline-block", accentLast && i === words.length - 1 && "text-lime")}
            variants={
              reduce
                ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
                : {
                    hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
                    show: { y: "0%", opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                  }
            }
          >
            {w}
          </motion.span>
        </span>
        {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.h1>
  );
}
