export function ResultsCounter({ count }: { count?: number }) {
  return (
    <div className="mx-4 mt-3 text-xs uppercase md:mx-12">
      {count ?? 0} results
    </div>
  );
}
