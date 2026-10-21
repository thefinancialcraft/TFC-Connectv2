import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface CustomSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (CustomSelectOption | string)[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  disabled = false,
  searchable = false,
  className = '',
  size = 'md',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuCoords, setMenuCoords] = useState<{
    top: number;
    left: number;
    width: number;
    placeAbove: boolean;
  }>({
    top: 0,
    left: 0,
    width: 0,
    placeAbove: false,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to CustomSelectOption objects
  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Position calculation with viewport boundary detection
  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < 220 && rect.top > 220;

    setMenuCoords({
      top: placeAbove ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 160),
      placeAbove,
    });
  }, []);

  // Listen to outside click, scroll, and resize when dropdown is open
  useEffect(() => {
    if (!isOpen) return;

    updateCoords();

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    function handleReposition() {
      updateCoords();
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, updateCoords]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen, searchable]);

  // Filter options if search query is provided
  const filteredOptions = normalizedOptions.filter((opt) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      opt.label.toLowerCase().includes(q) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  });

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const isSmall = size === 'sm';

  return (
    <div className={`relative inline-block w-full ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            updateCoords();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full flex items-center justify-between text-left transition-all outline-none rounded-lg border bg-white ${
          isSmall ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-xs'
        } ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : isOpen
            ? 'border-[#4b33e8] ring-3 ring-[#4b33e8]/10'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {selectedOption?.icon && (
            <i className={`fi ${selectedOption.icon} text-gray-500 shrink-0 text-xs`}></i>
          )}
          {selectedOption ? (
            <span className="font-semibold text-black truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-gray-400 font-normal truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedOption?.badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              {selectedOption.badge}
            </span>
          )}
          <i
            className={`fi fi-rr-angle-small-down text-gray-400 transition-transform duration-200 text-xs ${
              isOpen ? 'rotate-180 text-[#4b33e8]' : ''
            }`}
          ></i>
        </div>
      </button>

      {/* Floating Dropdown Menu mounted via Portal to escape modal overflow clipping */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuCoords.placeAbove ? 'auto' : `${menuCoords.top}px`,
              bottom: menuCoords.placeAbove
                ? `${window.innerHeight - menuCoords.top}px`
                : 'auto',
              left: `${menuCoords.left}px`,
              width: `${menuCoords.width}px`,
              zIndex: 99999,
            }}
            className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Search bar inside dropdown if searchable */}
            {searchable && (
              <div className="p-2 border-b border-gray-100 bg-gray-50/60">
                <div className="relative">
                  <i className="fi fi-rr-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]"></i>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-black font-medium outline-none focus:border-[#4b33e8]"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="py-3 px-3 text-center text-xs text-gray-400 font-medium">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#4b33e8]/10 text-[#4b33e8] font-bold'
                          : 'hover:bg-gray-50 text-black font-medium'
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <div className="flex items-center gap-2">
                          {opt.icon && <i className={`fi ${opt.icon} text-xs shrink-0`}></i>}
                          <span className="truncate">{opt.label}</span>
                        </div>
                        {opt.sublabel && (
                          <span className="text-[10px] text-gray-400 font-normal mt-0.5 truncate">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {opt.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <i className="fi fi-rr-check text-xs text-[#4b33e8] font-bold"></i>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
