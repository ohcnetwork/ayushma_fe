import { twMerge } from "tailwind-merge";

export function Input(
  props: {
    errors?: string[];
    loading?: boolean;
    right?: React.ReactNode;
    left?: React.ReactNode;
  } & React.InputHTMLAttributes<HTMLInputElement>
) {
  const { className, loading, errors, right, left, ...rest } = props;

  return (
    <div>
      <div className="border border-gray-200 w-full bg-white rounded-lg overflow-hidden relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1">
        {loading && <div className="absolute inset-0 bg-black/10" />}
        {left}
        <input
          {...rest}
          className={twMerge(
            "border-none bg-transparent flex-1 p-2 px-4 outline-none",
            className
          )}
          disabled={loading}
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
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { className, loading, errors, right, left, ...rest } = props;

  return (
    <>
      <div className="border border-gray-200 w-full bg-white rounded-lg overflow-hidden relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1">
        {loading && <div className="absolute inset-0 bg-black/10" />}
        {left}
        <textarea
          {...rest}
          className={twMerge(
            "border-none bg-transparent flex-1 p-2 px-4 outline-none",
            className
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
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { children, className, disabled, loading, ...rest } = props;

  const baseClasses = "rounded-lg p-2 px-4 flex items-center justify-center";
  const primaryClasses = `bg-green-500 transition-all text-white cursor-not-allowed ${
    !disabled && "hover:bg-green-600 cursor-auto"
  }`;
  const secondaryClasses = `bg-white transition-all text-gray-700 cursor-not-allowed ${
    !disabled && "hover:bg-slate-200 cursor-auto"
  }`;
  const dangerClasses = `bg-red-500 transition-all text-white cursor-not-allowed ${
    !disabled && "hover:bg-red-600 cursor-auto"
  }`;
  const classes = twMerge(
    baseClasses,
    props.variant === "secondary"
      ? secondaryClasses
      : props.variant === "danger"
      ? dangerClasses
      : primaryClasses,
    className
  );
  return (
    <button {...rest} className={classes}>
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block"></div>
      ) : (
        children
      )}
    </button>
  );
}

export function Errors(props: { errors?: string[] }) {
  const { errors } = props;

  return (
    <div className="flex flex-col">
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
  } & React.InputHTMLAttributes<HTMLInputElement>
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
