import { useState } from "react";
import { Link } from "react-router-dom";
import app_logo from "../assets/images/rmu-logo.png";
import { User, Settings, Star, LogOut } from "lucide-react";

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "Universities", href: "/client-universities", current: false },
  { name: "Rankings", href: "/client-rankings", current: false },
  { name: "About", href: "/client-about", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={app_logo}
              alt="Rate My University Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                item.current
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600 transition-colors",
                "font-medium"
              )}
            >
              {item.name}
            </Link>
          ))}

          <div className="relative">
            <button
              className="rounded-full h-10 w-10 bg-blue-50 flex items-center justify-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <User className="h-5 w-5 text-blue-600" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/account"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <Link
                  to="/account"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Star className="mr-2 h-4 w-4" />
                  <span>My Ratings</span>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    /* Add logout logic */
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="rounded-full h-10 w-10 bg-blue-50 flex items-center justify-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <User className="h-5 w-5 text-blue-600" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-100"></div>
              <Link
                to="/account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <Link
                to="/account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Ratings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
