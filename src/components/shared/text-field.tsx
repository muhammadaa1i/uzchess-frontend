"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type TextFieldVariant = "default" | "password" | "phone"

interface TextFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  variant?: TextFieldVariant
  label?: string
  description?: string
  errors?: Array<{ message?: string } | undefined>
}

function TextField({
  variant = "default",
  label,
  description,
  errors,
  className,
  id,
  placeholder,
  inputMode,
  ...rest
}: TextFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const generatedId = React.useId()
  const fieldId = id ?? generatedId
  const isInvalid = Boolean(errors?.length)

  const inputType =
    variant === "password"
      ? showPassword
        ? "text"
        : "password"
      : variant === "phone"
        ? "tel"
        : "text"

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <FieldContent>
        <div className="relative flex items-center">
          {variant === "phone" && (
            <span className="pointer-events-none absolute left-2.5 text-sm text-muted-foreground">
              +998
            </span>
          )}
          <Input
            {...rest}
            id={fieldId}
            type={inputType}
            inputMode={variant === "phone" ? "numeric" : inputMode}
            placeholder={variant === "phone" ? "__ ___ __ __" : placeholder}
            aria-invalid={isInvalid ? true : undefined}
            className={cn(
              variant === "phone" && "pl-12",
              variant === "password" && "pr-9",
              className
            )}
          />
          {variant === "password" && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          )}
        </div>
        {description && <FieldDescription>{description}</FieldDescription>}
        <FieldError errors={errors} />
      </FieldContent>
    </Field>
  )
}

export { TextField }
export type { TextFieldProps, TextFieldVariant }
