import * as React from "react";
import { Button } from "../ui/button";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;

  /** left icon  */
  iconSrc?: string;
  iconAlt?: string;

  /** right button label & options */
  buttonLabel?: string;
  buttonDisabled?: boolean;
  className?: string;
};

export default function InputArea({
  value,
  onChange,
  onSubmit,
  placeholder = "Enter Code...",
  iconSrc = "/gameButton.svg",
  iconAlt = "",
  buttonLabel = "Start",
  buttonDisabled,
  className,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!buttonDisabled) onSubmit();
      }}
      aria-label="Join a room"
      className={[
        "mx-auto grid w-[min(640px,92vw)] grid-cols-[1fr_auto] items-center gap-3",
        "rounded-[20px] border border-[#D8AF2A] bg-[rgba(27,34,70,0.55)] px-4 py-3",
        "backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,200,33,0.10)_inset]",
        className ?? "",
      ].join(" ")}
    >
      {/* field + icon */}
      <label className="relative w-full" aria-label={placeholder}>
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={iconAlt}
            aria-hidden={!iconAlt}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-[28px] w-[28px] opacity-95"
          />
        ) : null}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          className={[
            "h-[60px] w-full rounded-[15px] border-0 bg-gray-500",
            iconSrc ? "pl-14" : "pl-3",
            "pr-3 text-[16px] md:text-[15px] text-white",
            "placeholder:text-white/55 leading-[60px]",
            "shadow-[inset_0_0_0_1px_rgba(255,200,33,0.08)] focus:outline-none",
          ].join(" ")}
        />
      </label>

      {/* right action */}
      <Button
        type="submit"
        size="lg"
        disabled={buttonDisabled}
        className={[
          "h-[48px] box-radius px-6 font-extrabold btn-text",
          "btn-secondary",
          "shadow-[0_8px_22px_rgba(255,170,70,0.35),inset_0_2px_0_rgba(0,0,0,0.12)]",
          "hover:brightness-105",
        ].join(" ")}
      >
        {buttonLabel}
      </Button>
    </form>
  );
}
