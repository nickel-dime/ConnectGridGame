"use client";
import React, { Fragment, forwardRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SearchPlayer from "../components/combobox";

const MyModal = ({ isOpen, setIsOpen, setPlayerSelected, boxId }, ref) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center p-4 text-center mt-4 sm:mt-16">
              <Dialog.Panel className=" max-w-md rounded-lg align-middle transition-all">
                <SearchPlayer
                  setClose={() => {
                    setIsOpen(false);
                  }}
                  setPlayerSelected={setPlayerSelected}
                  boxId={boxId}
                  ref={ref}
                ></SearchPlayer>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default forwardRef(MyModal);
