import * as React from "react"
import { cn } from "@/lib/utils" // utility to merge Tailwind CSS class strings

// ---------------- MAIN CARD CONTAINER ----------------
const Card = React.forwardRef<
  HTMLDivElement, // This component renders a <div>
  React.HTMLAttributes<HTMLDivElement> // Accepts normal <div> HTML props
>(({ className, ...props }, ref) => (
  <div
    ref={ref} // Allows parent components to directly reference this DOM node
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // default styles
      className // merges any extra classes you pass in
    )}
    {...props} // spread other props like onClick, style, etc.
  />
))
Card.displayName = "Card"

// ---------------- HEADER SECTION ----------------
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)} // flex layout + spacing
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

// ---------------- TITLE ----------------
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

// ---------------- DESCRIPTION ----------------
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)} // small, muted text
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

// ---------------- CONTENT ----------------
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} /> // main body
  )
)
CardContent.displayName = "CardContent"

// ---------------- FOOTER ----------------
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)} // for actions/buttons
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// Export all subcomponents so they can be imported individually
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
