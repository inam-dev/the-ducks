import type { User } from "../types/auth";

type Props = {
  user: User;
  compact?: boolean;
};

const badgeStyles = {
  1: "border-slate-300 bg-slate-100 text-slate-800",
  2: "border-blue-300 bg-blue-50 text-blue-800",
  3: "border-teal-300 bg-teal-50 text-teal-800",
  4: "border-yellow-300 bg-yellow-50 text-yellow-900",
};

export function DbsAccessBadge({ user, compact = false }: Props) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${badgeStyles[user.accessLevel]}`}>
      <span className="text-xs font-bold">Level {user.accessLevel}</span>
      {!compact && (
        <>
          <span className="text-xs opacity-60">|</span>
          <span className="text-sm font-semibold">{user.accessLabel}</span>
        </>
      )}
    </div>
  );
}
