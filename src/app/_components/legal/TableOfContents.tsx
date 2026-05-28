export interface TocItem {
  /** Anchor id of the section heading (matches `<h2 id="...">`). */
  id: string;
  /** Visible label. */
  label: string;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <nav
      aria-label="목차"
      className="bg-white rounded-lg shadow-sm p-5 text-base"
    >
      <p className="font-semibold text-[#0F1A35] mb-3 text-lg">📋 목차</p>
      <ol className="space-y-2">
        {items.map((item, idx) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block text-gray-700 hover:text-[#10367D] hover:bg-[#BFE38A]/15 rounded px-2 py-1 leading-snug"
            >
              <span className="text-gray-400 mr-2">{idx + 1}.</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
