import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BsGearFill } from "react-icons/bs";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Setting({}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <SettingModal open={open} setOpen={setOpen}></SettingModal>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        <BsGearFill className="fill-green hover:fill-indigo-900"></BsGearFill>
      </button>
    </div>
  );
}

function SettingModal({ open, setOpen }) {
  //   const [open, setOpen] = useState(true);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold leading-6 text-gray-900"
                    >
                      Settings
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Change the settings for the connect grid.
                      </p>

                      <div className="w-full border-t border-gray-100 mt-4"></div>

                      <div className="mt-4">
                        <div className="hidden sm:block">
                          <CardChoices></CardChoices>
                        </div>
                        <div className="sm:hidden">
                          <CardChoicesMobile></CardChoicesMobile>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-900 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

const mailingLists = [
  {
    id: 1,
    title: "Newsletter",
    description: "Last message sent an hour ago",
    users: "621 users",
  },
  {
    id: 2,
    title: "Existing Customers",
    description: "Last message sent 2 weeks ago",
    users: "1200 users",
  },
  {
    id: 3,
    title: "Trial Users",
    description: "Last message sent 4 days ago",
    users: "2740 users",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CardChoices() {
  const [selectedMailingLists, setSelectedMailingLists] = useState(
    mailingLists[0]
  );

  return (
    <RadioGroup value={selectedMailingLists} onChange={setSelectedMailingLists}>
      <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
        Select a mailing list
      </RadioGroup.Label>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {mailingLists.map((mailingList) => (
          <RadioGroup.Option
            key={mailingList.id}
            value={mailingList}
            className={({ active }) =>
              classNames(
                active
                  ? "border-indigo-600 ring-2 ring-indigo-600"
                  : "border-gray-300",
                "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                    >
                      {mailingList.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {mailingList.description}
                    </RadioGroup.Description>
                    <RadioGroup.Description
                      as="span"
                      className="mt-6 text-sm font-medium text-gray-900"
                    >
                      {mailingList.users}
                    </RadioGroup.Description>
                  </span>
                </span>
                <CheckCircleIcon
                  className={classNames(
                    !checked ? "invisible" : "",
                    "h-5 w-5 text-indigo-600"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={classNames(
                    active ? "border" : "border-2",
                    checked ? "border-indigo-600" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}

const settings = [
  {
    name: "Public access",
    description: "This project would be available to anyone who has the link",
  },
  {
    name: "Private to Project Members",
    description: "Only members of this project would be able to access",
  },
  {
    name: "Private to you",
    description: "You are the only one able to access this project",
  },
];

function CardChoicesMobile() {
  const [selected, setSelected] = useState(settings[0]);

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
      <div className="-space-y-px rounded-md bg-white">
        {settings.map((setting, settingIdx) => (
          <RadioGroup.Option
            key={setting.name}
            value={setting}
            className={({ checked }) =>
              classNames(
                settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                settingIdx === settings.length - 1
                  ? "rounded-bl-md rounded-br-md"
                  : "",
                checked
                  ? "z-10 border-indigo-200 bg-indigo-50"
                  : "border-gray-200",
                "relative flex cursor-pointer border p-4 focus:outline-none"
              )
            }
          >
            {({ active, checked }) => (
              <>
                <span
                  className={classNames(
                    checked
                      ? "bg-indigo-600 border-transparent"
                      : "bg-white border-gray-300",
                    active ? "ring-2 ring-offset-2 ring-indigo-600" : "",
                    "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center"
                  )}
                  aria-hidden="true"
                >
                  <span className="rounded-full bg-white w-1.5 h-1.5" />
                </span>
                <span className="ml-3 flex flex-col">
                  <RadioGroup.Label
                    as="span"
                    className={classNames(
                      checked ? "text-indigo-900" : "text-gray-900",
                      "block text-sm font-medium"
                    )}
                  >
                    {setting.name}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className={classNames(
                      checked ? "text-indigo-700" : "text-gray-500",
                      "block text-sm"
                    )}
                  >
                    {setting.description}
                  </RadioGroup.Description>
                </span>
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
