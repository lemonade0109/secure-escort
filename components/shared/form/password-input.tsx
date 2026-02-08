"use client";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput = ({
  className,
  label,
  value,
  onChange,
  name,
  placeholder,
  ...props
}: PasswordInputProps) => {
  const [show, setShow] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: _type, ...inputProps } = props as Omit<
    PasswordInputProps,
    "className" | "label" | "name" | "value" | "onChange"
  >;
  return (
    <div className="mb-2 gap-1 flex flex-col relative">
      <Label
        htmlFor={name}
        className={`capitalize text-sm sm:text-base ${className ?? ""}`}
      >
        {label || name}
      </Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          {...inputProps}
          autoComplete="new-password"
          placeholder={placeholder}
          className={`pr-12 text-sm sm:text-base ${className ?? ""}`}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Button
            type="button"
            variant="ghost"
            onMouseDown={(e) => e.preventDefault()}
            size="icon"
            onClick={() => setShow(!show)}
            className="pointer-events-auto p-0 bg-transparent shadow-none border-none hover:bg-transparent active:bg-transparent focus:bg-transparent flex items-center justify-center h-8 w-8"
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
