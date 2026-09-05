interface CategoryBadgeProps {
  name: string;
}

export function CategoryBadge({ name }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-transparent bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
      {name}
    </span>
  );
}

export default CategoryBadge;
