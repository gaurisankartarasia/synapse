"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const ActionDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-80 max-w-lg translate-x-[-50%] translate-y-[-50%] gap-0 border bg-background shadow-lg sm:rounded-xl",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">
        Actions
      </DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
ActionDialogContent.displayName = "ActionDialogContent"

const DialogActionItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "w-full text-center px-6 py-4 text-sm focus:outline-none rounded-xl active:bg-accent",
      className
    )}
    {...props}
  />
))
DialogActionItem.displayName = "DialogActionItem"

const DialogSeparator = ({ className }: { className?: string }) => (
  <div className={cn("h-px w-full bg-border", className)} />
)

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  ActionDialogContent as DialogContent,
  DialogActionItem as DialogItem,
  DialogSeparator as DialogSeparator,
}



