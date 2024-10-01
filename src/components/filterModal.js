import {useState} from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import FilterCheckboxes from './filterCheckbox';

export default function FilterModal({toggleModal}) {
  const [open, setOpen] = useState(true);

  const handleFilterModal = () => {
    setOpen(false);
    toggleModal();
  }

  return (
     <Dialog open={open} onClose={handleFilterModal} className="relative z-10">
       <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex flex-col space-y-2 sm:flex sm:items-center">
                
                <div className="self-start text-center w-full sm:ml-4 sm:mt-0 sm:text-left gap-4 sm:gap-20">
                  
                  <div className='flex flex-row justify-start items-center gap-4 '>
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Filter Settings
                    </DialogTitle>
                  </div>

                </div>
                  
                <div className='w-full'>
                  <FilterCheckboxes/>
                </div>
                
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleFilterModal}
                className={`inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto hover:bg-hs-orange-light bg-hs-orange `}
              >
                Save
              </button>

              {/* will reset the form if the discard button is pressed  */}
              <button
                type="button"
                data-autofocus
                onClick={handleFilterModal}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Discard 
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
