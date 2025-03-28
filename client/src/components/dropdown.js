import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export default function DropDown({ onSelect, selectedCategory }) {
  const handleSelect = (category) => {
    onSelect(category); // Call the provided callback with the selected category
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {selectedCategory ? selectedCategory : "Sort by"}{" "}
          {/* Show selected category */}
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          {[
            "StudentLife",
            "ClassesTeachers",
            "Cost",
            "ReturnOnInvestment",
            "DiningFood",
            "DormsHousing",
            "HealthSafety",
            "CitySetting",
          ].map((category) => (
            <MenuItem key={category}>
              <button
                onClick={() => handleSelect(category)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {category}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
