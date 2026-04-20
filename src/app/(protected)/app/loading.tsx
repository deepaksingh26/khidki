export default function AppLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-[1.75rem] border border-khidkee-earth/10 bg-white/70" />
      ))}
    </div>
  );
}

