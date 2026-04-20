type FormMessageProps = {
  tone: "success" | "error";
  message: string;
};

export function FormMessage({ tone, message }: FormMessageProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-khidkee-green/20 bg-khidkee-green/10 text-khidkee-green"
          : "border-khidkee-red/20 bg-khidkee-red/10 text-khidkee-red"
      }`}
    >
      {message}
    </div>
  );
}

