"use client";
import React, { Fragment, forwardRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Example from "../components/combobox";
import Modal from "react-bootstrap/Modal";

const MyModal = ({ isOpen, setIsOpen, setPlayerSelected, boxId }, ref) => {
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* <Transition appear show={isOpen} as={Fragment}> */}
      <Modal
        as="div"
        className="relative z-10"
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        enforceFocus={false}
      >
        {/* <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          > */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        {/* </Transition.Child> */}

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex justify-center p-4 text-center mt-4 sm:mt-16">
            {/* <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              > */}
            <Modal.Body className=" max-w-md rounded-lg align-middle transition-all">
              <Example
                setClose={() => {
                  setIsOpen(false);
                }}
                setPlayerSelected={setPlayerSelected}
                boxId={boxId}
                ref={ref}
              ></Example>
            </Modal.Body>
            {/* </Transition.Child> */}
          </div>
        </div>
      </Modal>
      {/* </Transition> */}
    </>
  );
};

export default forwardRef(MyModal);
