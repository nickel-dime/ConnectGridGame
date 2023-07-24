import {
  Fragment,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { Dialog, Transition, Switch, Tab } from "@headlessui/react";
import { BsGearFill } from "react-icons/bs";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { updateSettings } from "@/app/store/normalSlice";

const SettingContext = createContext(null);

export default function Setting({ mode, setMode }) {
  const [open, setOpen] = useState(false);

  const isEndless = useAppSelector((state) => state.isEndless);
  const league = useAppSelector((state) => state.league);

  const [modalEndless, setModalEndless] = useState(null);
  const [modalLeague, setModalLeague] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  useEffect(() => {
    setModalEndless(isEndless);
    setModalLeague(league);
    setModalMode(mode);
  }, [isEndless, league, mode]);

  useEffect(() => {
    const localUser = localStorage.getItem("initial") ? false : true;
    setOpen(localUser);
    localStorage.setItem("initial", "false");
  }, []);

  return (
    <div>
      <SettingContext.Provider
        value={{
          modalEndless: modalEndless,
          setModalEndless: setModalEndless,
          modalLeague: modalLeague,
          setModalLeague: setModalLeague,
          modalMode: modalMode,
          setModalMode: setModalMode,
          setMode: setMode,
        }}
      >
        <SettingModal open={open} setOpen={setOpen}></SettingModal>
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="p-1"
        >
          <BsGearFill className="fill-green-500 hover:fill-purple"></BsGearFill>
        </button>
      </SettingContext.Provider>
    </div>
  );
}

function SettingModal({ open, setOpen }) {
  //   const [open, setOpen] = useState(true);

  const { modalEndless, modalLeague, modalMode, setMode } =
    useContext(SettingContext);
  const dispatch = useAppDispatch();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={(e) => {
          setOpen(e);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
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
                  <div className="text-center mt-2 sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold leading-6 text-gray-900"
                    >
                      Settings
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 hidden sm:block">
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
                      <div className="w-full border-t border-gray-100 mt-4"></div>
                      <div className="mt-4">
                        <Unlimited></Unlimited>
                      </div>
                      <div className="w-full border-t border-gray-100 mt-4"></div>
                      <div className="mt-4  ">
                        <LeagueChooser></LeagueChooser>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:hover:bg-purple sm:ml-3 sm:w-auto"
                    onClick={() => {
                      // update settings
                      dispatch(
                        updateSettings({
                          league: modalLeague,
                          isEndless: modalEndless,
                        })
                      );
                      setMode(modalMode);
                      localStorage.setItem("mode", modalMode);
                      setOpen(false);
                    }}
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

const modes_desktop = {
  normal: {
    title: "Normal",
    description: "Given 9 guesses, fill out as much of the grid as you can.",
    disbaled: false,
  },
  timer: {
    title: "Timer (coming soon)",
    description:
      "You have 5 minutes! Be careful, every wrong guess loses you 10 seconds.",
    disabled: true,
  },
  backwards: {
    title: "Backwards (coming soon)",
    description:
      "You are given the players - fill out the clues to complete the grid.",
    disabled: true,
  },
};

const modes_switch = ["normal", "timer", "backwards"];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function CardChoices() {
  const { modalMode, setModalMode } = useContext(SettingContext);

  function getIndex() {
    if (modalMode == "normal" || modalMode.id == "normal") {
      return 0;
    } else if (modalMode == "timer" || modalMode.id == "") {
      return 1;
    }
  }

  return (
    <RadioGroup value={modalMode} onChange={setModalMode}>
      <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
        Choose Mode
      </RadioGroup.Label>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
        {modes_switch.map((mode) => (
          <RadioGroup.Option
            key={mode}
            value={mode}
            disabled={modes_desktop[mode].disabled}
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
                      className={classNames(
                        modes_desktop[mode].disabled
                          ? "text-gray-500"
                          : "text-gray-900",
                        "block text-sm font-medium "
                      )}
                    >
                      {modes_desktop[mode].title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {modes_desktop[mode].description}
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
    name: "Normal",
    description: "Given 9 guesses, fill out as much of the grid as you can",
    disabled: false,
  },
  {
    name: "Timer (coming soon)",
    description:
      "You have 5 minutes! Careful though, every wrong guess loses 10 seconds",
    disabled: true,
  },
  {
    name: "Backwards (coming soon)",
    description:
      "You are given the players - fill out the clues to complete the grid.",
    disabled: true,
  },
];

function CardChoicesMobile() {
  const [selected, setSelected] = useState(settings[0]);

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
      <div className="-space-y-px rounded-md bg-white text-left">
        {settings.map((setting, settingIdx) => (
          <RadioGroup.Option
            key={setting.name}
            disabled={setting.disabled}
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
                      checked ? "text-purple" : "text-gray-900",
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

function Unlimited() {
  const { modalEndless, setModalEndless } = useContext(SettingContext);

  return (
    <Switch.Group
      as="div"
      className="flex items-center justify-between text-left ml-1"
    >
      <span className="flex flex-grow flex-col">
        <Switch.Label
          as="span"
          className="text-base font-semibold leading-6 text-gray-900"
          passive
        >
          Unlimited Grids
        </Switch.Label>
        <Switch.Description
          as="span"
          className="text-sm text-gray-500 mt-1 hidden sm:block"
        >
          Toggle between playing only the daily grid or playing endless grids.
        </Switch.Description>
      </span>
      <Switch
        checked={modalEndless}
        onChange={() => {
          setModalEndless(!modalEndless);
        }}
        className={classNames(
          modalEndless ? "bg-purple" : "bg-gray-200",
          "relative ml-2 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-offset-2"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            modalEndless ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}

const leagues = [
  { name: "NBA", disbaled: false },
  { name: "NFL", disabled: false },
  { name: "MLB", disabled: true },
];

function LeagueChooser() {
  const { modalLeague, setModalLeague } = useContext(SettingContext);

  function getIndex() {
    if (modalLeague == "NBA") {
      return 0;
    } else if (modalLeague == "NFL") {
      return 1;
    } else if (modalLeague == "MLB") {
      return 2;
    }
  }

  return (
    <div className="w-full max-w-md sm:px-0 text-left ">
      <Tab.Group
        onChange={(index) => {
          setModalLeague(leagues[index].name);
        }}
        selectedIndex={getIndex()}
      >
        <span className="text-base font-semibold leading-6 text-gray-900">
          Choose League
        </span>
        <Tab.List className="flex space-x-4 sm:space-x-4 rounded-xl text-white mt-4">
          {leagues.map((league) => (
            <Tab
              key={league.name}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "",
                  selected
                    ? " shadow bg-indigo-900 sm:ring-1 sm:ring-black sm:ring-offset-1 focus:ring-1 focus:ring-black focus:ring-offset-1"
                    : league.disabled
                    ? "text-white"
                    : "hover:bg-green-600 text-white",
                  league.disabled
                    ? "text-gray-500 bg-gray-500 hover:bg-gray-500"
                    : " bg-green-500"
                )
              }
              disabled={league.disabled}
            >
              {league.name}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
    </div>
  );
}
