import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Input(
  props: {
    errors?: string[];
    loading?: boolean;
    right?: React.ReactNode;
    left?: React.ReactNode;
    parentDivClassName?: string;
    disabled?: boolean;
  } & React.InputHTMLAttributes<HTMLInputElement>,
) {
  const {
    className,
    loading,
    errors,
    right,
    left,
    parentDivClassName,
    disabled,
    ...rest
  } = props;

  return (
    <div className={parentDivClassName}>
      <div className="border border-secondaryActive w-full p-0.5 bg-primary rounded-lg overflow-hidden relative transition ring-0 ring-indigo-500 ring-offset-primary outline-0 focus-within:ring-2 focus-within:ring-offset-1">
        {loading && <div className="absolute inset-0 bg-black/10" />}
        {left}
        <input
          {...rest}
          className={twMerge(
            "border-none bg-transparent w-full p-3 py-3 outline-none",
            className,
          )}
          disabled={props.disabled || loading}
        />
        {right}
      </div>
      <Errors errors={errors} />
    </div>
  );
}

export function TextArea(
  props: {
    errors?: string[];
    loading?: boolean;
    right?: React.ReactNode;
    left?: React.ReactNode;
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const { className, loading, errors, right, left, ...rest } = props;

  return (
    <>
      <div className="border border-secondaryActive w-full p-0.5 bg-primary rounded-lg overflow-hidden relative transition ring-0 ring-indigo-500 focus-within:ring-2 focus-within:ring-offset-1">
        {loading && <div className="absolute inset-0 bg-black/10" />}
        {left}
        <textarea
          {...rest}
          className={twMerge(
            "border-none bg-transparent w-full p-3 outline-none",
            className,
          )}
          disabled={loading}
        />
        {right}
      </div>
      <Errors errors={errors} />
    </>
  );
}

export function Button(
  props: {
    children: React.ReactNode;
    loading?: boolean;
    variant?: "primary" | "secondary" | "danger";
  } & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { children, className, loading, ...rest } = props;

  const baseClasses = "rounded-lg p-2 px-4 flex items-center justify-center";
  const primaryClasses =
    "bg-green-500 enabled:hover:bg-green-600 transition-all text-primary disabled:cursor-not-allowed";
  const secondaryClasses =
    "bg-secondary enabled:hover:bg-slate-200 transition-all text-gray-700 disabled:cursor-not-allowed";
  const dangerClasses =
    "bg-red-500 enabled:hover:bg-red-600 transition-all text-primary disabled:cursor-not-allowed";
  const classes = twMerge(
    baseClasses,
    props.variant === "secondary"
      ? secondaryClasses
      : props.variant === "danger"
        ? dangerClasses
        : primaryClasses,
    className,
  );
  return (
    <button {...rest} className={classes}>
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary inline-block"></div>
      ) : (
        children
      )}
    </button>
  );
}

export function Errors(props: { errors?: string[]; className?: string }) {
  const { errors } = props;

  return (
    <div className={`flex flex-col ${props.className}`}>
      {errors?.map((error, i) => (
        <div key={i} className="text-red-500 text-sm mt-2">
          {error}
        </div>
      ))}
    </div>
  );
}

export function CheckBox(
  props: {
    label: string;
  } & React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { label, ...rest } = props;

  return (
    <div>
      <label className="switch">
        <input type="checkbox" {...rest} />
        <span className="switch-slider" />
      </label>
      <span className="ml-2">{label}</span>
    </div>
  );
}

export function Dropdown(
  props: {
    errors?: string[];
    loading?: boolean;
    children: ReactNode;
  } & React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  const { className, children, loading, errors, ...rest } = props;

  return (
    <div>
      <div className="border border-secondaryActive w-full p-0.5 bg-primary rounded-lg overflow-hidden relative transition ring-0 ring-indigo-500 focus-within:ring-2 focus-within:ring-offset-1">
        {loading && <div className="absolute inset-0 bg-black/10" />}
        <select
          {...rest}
          className={twMerge(
            "border-none bg-transparent w-full p-3 outline-none",
            className,
          )}
          disabled={loading}
        >
          {children}
        </select>
      </div>
      <Errors errors={errors} />
    </div>
  );
}
