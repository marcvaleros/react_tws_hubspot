import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const {user} = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href) => {
    return location.pathname === href;
  }
  
  const navigation = [
    { name: 'Home', href: '/', current: true },
    ...(user.role === 'admin'? [{name: 'TWS Franchisee', href: '/tws_franchisee', current: false}] : []),
    ...(user.role === 'admin'? [{name: 'Users', href: '/users', current: false}] : []),
    { name: 'Versions', href: '/version', current: false },
  ]


  const handleLogOut = () => {
    //erase the localstorage before logout 
    localStorage.removeItem('authToken');
    localStorage.removeItem('selectedFranchisee');
    navigate('/magic-link-request');
  }

  return (
    <Disclosure as="nav" className="bg-hs-blue ">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 text-white">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <h1 className='text-2xl text-hs-background mx-auto cursor-pointer'>
                ZACH-O-MATIC ver 1.1 ✨
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive(item.href) ? 'bg-hs-background text-hs-blue' : 'transition-all ease-in-out text-300 hover:bg-hs-dark-blue hover:text-hs-background',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div
              className="relative rounded-full p-1 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 px-4 hidden lg:block"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <p className='hidden lg:block'>{user.email}</p>
            </div>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="/Zach.png"
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a href='#Home' onClick={handleLogOut} className="button cursor-pointer block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive(item.href) ? 'bg-hs-background text-hs-blue' : 'transition-all ease-in-out text-300 hover:bg-hs-dark-blue hover:text-hs-background',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
