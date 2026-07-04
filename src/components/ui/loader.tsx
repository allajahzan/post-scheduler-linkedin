export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="size-7 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
      <span className="text-sm font-medium">Loading...</span>
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader />
    </div>
  );
}
