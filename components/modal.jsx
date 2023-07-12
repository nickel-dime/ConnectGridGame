"use client";
import React, { Fragment, forwardRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Example from "../components/combobox";

const MyModal = ({ isOpen, setIsOpen, setPlayerSelected, boxId }, ref) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center p-4 text-center mt-4 sm:mt-16">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" max-w-md rounded-lg align-middle transition-all">
                  <Example
                    setClose={() => {
                      setIsOpen(false);
                    }}
                    setPlayerSelected={setPlayerSelected}
                    boxId={boxId}
                    ref={ref}
                  ></Example>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default forwardRef(MyModal);
