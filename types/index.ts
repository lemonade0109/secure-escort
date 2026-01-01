export type actionFunction<T> = (
  prevState: T,
  formData: FormData
) => T | Promise<T>;

export type FormContainerProps = {
  action: actionFunction<FormActionState>;
  children: React.ReactNode | ((data: FormActionState) => React.ReactNode);
  className?: string;
  onReset?: () => void;
};

export type FormActionState = {
  message?: string;
  redirectTo?: string;
  success?: boolean;
};

export type GlowBackgroundProps = {
  intensity: "soft" | "medium" | "strong";
};
