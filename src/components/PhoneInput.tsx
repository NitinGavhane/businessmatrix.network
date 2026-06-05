"use client";

import { useState, useRef, useEffect, useMemo } from "react";

const countries = [
  { flag: "🇮🇳", code: "IN", dial: "+91", name: "India" },
  { flag: "🇺🇸", code: "US", dial: "+1", name: "United States" },
  { flag: "🇬🇧", code: "GB", dial: "+44", name: "United Kingdom" },
  { flag: "🇨🇦", code: "CA", dial: "+1", name: "Canada" },
  { flag: "🇦🇺", code: "AU", dial: "+61", name: "Australia" },
  { flag: "🇩🇪", code: "DE", dial: "+49", name: "Germany" },
  { flag: "🇫🇷", code: "FR", dial: "+33", name: "France" },
  { flag: "🇯🇵", code: "JP", dial: "+81", name: "Japan" },
  { flag: "🇨🇳", code: "CN", dial: "+86", name: "China" },
  { flag: "🇧🇷", code: "BR", dial: "+55", name: "Brazil" },
  { flag: "🇷🇺", code: "RU", dial: "+7", name: "Russia" },
  { flag: "🇿🇦", code: "ZA", dial: "+27", name: "South Africa" },
  { flag: "🇸🇬", code: "SG", dial: "+65", name: "Singapore" },
  { flag: "🇦🇪", code: "AE", dial: "+971", name: "UAE" },
  { flag: "🇸🇦", code: "SA", dial: "+966", name: "Saudi Arabia" },
  { flag: "🇰🇷", code: "KR", dial: "+82", name: "South Korea" },
  { flag: "🇮🇩", code: "ID", dial: "+62", name: "Indonesia" },
  { flag: "🇲🇾", code: "MY", dial: "+60", name: "Malaysia" },
  { flag: "🇵🇭", code: "PH", dial: "+63", name: "Philippines" },
  { flag: "🇻🇳", code: "VN", dial: "+84", name: "Vietnam" },
  { flag: "🇹🇭", code: "TH", dial: "+66", name: "Thailand" },
  { flag: "🇳🇬", code: "NG", dial: "+234", name: "Nigeria" },
  { flag: "🇰🇪", code: "KE", dial: "+254", name: "Kenya" },
  { flag: "🇪🇬", code: "EG", dial: "+20", name: "Egypt" },
  { flag: "🇲🇽", code: "MX", dial: "+52", name: "Mexico" },
  { flag: "🇦🇷", code: "AR", dial: "+54", name: "Argentina" },
  { flag: "🇳🇱", code: "NL", dial: "+31", name: "Netherlands" },
  { flag: "🇸🇪", code: "SE", dial: "+46", name: "Sweden" },
  { flag: "🇨🇭", code: "CH", dial: "+41", name: "Switzerland" },
  { flag: "🇮🇹", code: "IT", dial: "+39", name: "Italy" },
  { flag: "🇪🇸", code: "ES", dial: "+34", name: "Spain" },
  { flag: "🇵🇹", code: "PT", dial: "+351", name: "Portugal" },
  { flag: "🇳🇴", code: "NO", dial: "+47", name: "Norway" },
  { flag: "🇩🇰", code: "DK", dial: "+45", name: "Denmark" },
  { flag: "🇫🇮", code: "FI", dial: "+358", name: "Finland" },
  { flag: "🇵🇰", code: "PK", dial: "+92", name: "Pakistan" },
  { flag: "🇧🇩", code: "BD", dial: "+880", name: "Bangladesh" },
  { flag: "🇱🇰", code: "LK", dial: "+94", name: "Sri Lanka" },
  { flag: "🇳🇵", code: "NP", dial: "+977", name: "Nepal" },
  { flag: "🇹🇷", code: "TR", dial: "+90", name: "Turkey" },
  { flag: "🇮🇷", code: "IR", dial: "+98", name: "Iran" },
  { flag: "🇮🇱", code: "IL", dial: "+972", name: "Israel" },
];

type PhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  name?: string;
  placeholder?: string;
};

export default function PhoneInput({
  value: externalValue,
  onChange,
  id = "ph",
  name = "phone",
  placeholder = "Phone",
}: PhoneInputProps) {
  const isControlled = externalValue !== undefined;

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => b.dial.length - a.dial.length),
    []
  );

  const parseValue = (val: string) => {
    const c = sortedCountries.find((c) => val.startsWith(c.dial)) || countries[0];
    return { country: c, number: val.slice(c.dial.length) };
  };

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [internalSelected, setInternalSelected] = useState(countries[0]);
  const [internalPhone, setInternalPhone] = useState("");

  const selected = isControlled ? parseValue(externalValue).country : internalSelected;
  const phoneNumber = isControlled ? parseValue(externalValue).number : internalPhone;

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const filtered = useMemo(
    () =>
      countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  function selectCountry(country: (typeof countries)[number]) {
    if (isControlled) {
      setInternalSelected(country);
      onChange?.(country.dial + phoneNumber);
    } else {
      setInternalSelected(country);
    }
    setOpen(false);
    setSearch("");
  }

  function handlePhoneChange(val: string) {
    if (isControlled) {
      onChange?.(selected.dial + val);
    } else {
      setInternalPhone(val);
    }
  }

  const [focused, setFocused] = useState(false);

  return (
    <div className="relative" ref={ref}>
      <div
        className={`flex items-stretch w-full transition-all duration-300 ${
          focused
            ? "bg-white border-[var(--brand-primary)] shadow-[0_0_0_4px_rgba(64,96,144,0.08)] -translate-y-px"
            : "bg-[rgba(248,250,252,0.5)] border-[var(--border)]"
        }`}
        style={{
          borderWidth: 1.5,
          borderStyle: "solid",
          borderRadius: "var(--radius-sm)",
          outline: "none",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 pl-3 pr-2 text-[15px] font-medium text-[var(--text-primary)] cursor-pointer bg-transparent shrink-0 border-r border-[var(--border)]"
          style={{ minWidth: 72 }}
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-[13px] font-medium">{selected.dial}</span>
          <svg
            viewBox="0 0 24 24"
            style={{
              width: 10,
              height: 10,
              stroke: "var(--text-muted)",
              fill: "none",
              strokeWidth: 2,
              transform: open ? "rotate(180deg)" : undefined,
              transition: "transform 0.2s",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="tel"
          id={id}
          name={name}
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pr-3.5 text-[15px] font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          style={{ paddingLeft: 10 }}
        />
      </div>

      {open && (
        <div
          className="absolute left-0 z-50 mt-1 bg-white border border-[var(--border)] rounded-[6px] shadow-lg"
          style={{ width: 280, maxHeight: 300 }}
        >
          <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full border rounded-[4px] px-2.5 py-1.5 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] placeholder:text-[var(--text-muted)]"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 252 }}>
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-[13px] text-[var(--text-muted)] text-center">
                No countries found
              </div>
            ) : (
              filtered.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => selectCountry(country)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] transition-colors ${
                    selected.code === country.code
                      ? "bg-[rgba(64,96,144,0.1)] text-[var(--brand-primary)] font-medium"
                      : "text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.03)]"
                  }`}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-[13px] text-[var(--text-muted)]">{country.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
