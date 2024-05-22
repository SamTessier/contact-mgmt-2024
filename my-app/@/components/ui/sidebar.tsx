import { useState } from 'react';
import { Bars2Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`flex-shrink-0 transition-width duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'}`}>
      <button
        onClick={toggleSidebar}
        className="p-2 focus:outline-none focus:bg-gray-200 rounded-md absolute top-2 left-2 z-50"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-800" />
        ) : (
          <Bars2Icon className="w-6 h-6 text-gray-800" />
        )}
      </button>
      <div className={`fixed top-0 left-0 h-full bg-white shadow-md transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <h2 className="text-xl font-semibold">Sidebar</h2>
          <nav className="mt-4">
            <ul>
              <li className="py-2">
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Item 1
                </a>
              </li>
              <li className="py-2">
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Item 2
                </a>
              </li>
              <li className="py-2">
                <a href="#" className="text-gray-700 hover:text-gray-900">
                  Item 3
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
