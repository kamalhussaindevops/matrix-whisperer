"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-xl bg-background p-2 shadow-lg", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row sm:gap-6",
        month: "space-y-4 rounded-xl border border-border/70 bg-card/80 p-3 shadow-soft",
        caption: "relative flex items-center justify-center pb-2 pt-1",
        caption_label: "font-display text-base tracking-wide text-foreground",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between px-1 pt-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background/80 p-0 text-muted-foreground shadow-none hover:bg-secondary hover:text-foreground",
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse space-y-1 overflow-hidden rounded-lg",
        head_row: "flex",
        head_cell: "text-muted-foreground w-9 rounded-md py-2 font-medium text-[0.72rem] uppercase tracking-[0.16em]",
        row: "flex w-full mt-2",
        cell: "h-10 w-10 p-0 text-center text-sm relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-10 w-10 rounded-full p-0 font-normal transition-all aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-primary text-primary-foreground shadow-glow hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "border border-primary/40 bg-primary/10 text-primary",
        day_outside:
          "day-outside text-muted-foreground/45 opacity-60 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground/35 opacity-40",
        day_range_middle: "aria-selected:bg-accent/20 aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
