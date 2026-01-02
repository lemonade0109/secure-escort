import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
};

const FormInput = (props: FormInputProps) => {
  const { label, name, type, defaultValue, placeholder, className } = props;
  return (
    <div className="mb-2 gap-2 flex flex-col">
      <Label htmlFor={name} className={`capitalize ${className}`}>
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
        className={`text-sm sm:text-base ${className}`}
      />
    </div>
  );
};

export default FormInput;
