import React from 'react';
import clsx from 'clsx';
import { Settings } from 'lucide-react';

const Sidebar = ({ isOpen, menuItems = [], onItemClick, isMini = false }) => {
  return (
    <div
      className={clsx(
        'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-gray-800 shadow-lg transition-all duration-200 ease-in-out',
        isOpen
          ? window.innerWidth < 768
            ? 'w-60 px-4'
            : isMini
            ? 'w-20 px-2'
            : 'w-60 px-4'
          : '-translate-x-full w-0',
        'overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600'
      )}
      aria-label="Navigation menu"
    >
      {/* Menu Items */}
      {menuItems.map((section, index) => (
        <div key={index} className="space-y-1 py-2">
          {/* Section Header */}
          {section.title && isOpen && (window.innerWidth < 768 || !isMini) && (
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {section.title}
            </h3>
          )}
          {section.items.map((item) => (
            <a
              key={item.label}
              href={item.path}
              onClick={(e) => {
                item.onClick?.(e);
                onItemClick?.();
              }}
              className={clsx(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                window.innerWidth < 768 || !isMini ? 'justify-start' : 'justify-center',
                item.isActive
                  ? 'bg-gray-700 text-teal-400'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-teal-400',
                'focus:outline-none focus:ring-2 focus:ring-teal-500'
              )}
              aria-label={item.label}
            >
              <span className={clsx(window.innerWidth < 768 || !isMini ? 'text-base' : 'text-xl')}>
                {item.icon}
              </span>
              {(window.innerWidth < 768 || !isMini) && <span className="truncate">{item.label}</span>}
            </a>
          ))}
          {/* Divider */}
          {index < menuItems.length - 1 && isOpen && (window.innerWidth < 768 || !isMini) && (
            <hr className="border-gray-700 mx-3" />
          )}
        </div>
      ))}

      {/* Footer (Settings) */}
      {isOpen && (window.innerWidth < 768 || !isMini) && (
        <div className="mt-auto pt-4">
          <a
            href="/settings"
            className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:text-teal-400 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Sidebar;