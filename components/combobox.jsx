import React, { Fragment, useContext, useState, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
export const HomeContext = React.createContext(null);

export default function Example({ setClose, setPlayerSelected, boxId }) {
  const { guessesLeft, setGuessesLeft, mode, teams } = useContext(HomeContext);

  const [selected, setSelected] = useState({});
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // setPeople([]);
    // split up query into first and last name
    var stringArray = query.split(/(\s+)/);

    var firstName = stringArray[0];

    if (firstName == "") {
      return;
    }

    if (stringArray.length > 1) {
      var lastName = stringArray[2];
      var url = `/api/players?firstName=${firstName}&lastName=${lastName}`;
    } else {
      var url = `/api/players?firstName=${firstName}`;
    }

    fetch(url)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        setTimeout(setPeople(data), 1000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  const checkPlayer = async (player, boxId, callback_after) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player: player,
        mode: mode,
        teams: teams,
      }),
    };

    fetch(`/api/check?boxId=${boxId}`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        callback_after(data["success"]);
      });
  };

  return (
    <div className="top-16 w-96">
      <Combobox
        value={selected}
        onChange={(value) => {
          setSelected(value);
          // make api call with value and box. if correct then setPlayerSelected and close else dont do either

          checkPlayer(value, boxId, (correct) => {
            if (correct) {
              setPlayerSelected(value);
              setClose();
            } else {
              // setSelected({});
            }

            setGuessesLeft(guessesLeft - 1);
          });
        }}
      >
        <div className="relative">
          <div className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none outline-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(person) => person.name}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              autoComplete="off"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-black"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {people === undefined || people.length == 0 ? (
                <div className="relative cursor-default select-none py-4 px-4 text-gray-700">
                  {isLoading ? "Loading" : "Nothing found."}
                </div>
              ) : (
                people.map((person) => (
                  <Combobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-3 pr-4 ${
                        active ? "bg-slate-50 text-green" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate text-left ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          <div className=" font-medium">
                            {person.firstName} {person.lastName} (
                            {person.position})
                          </div>
                          <div className=" text-gray-500">
                            {person.yearStart} - {person.yearEnd}
                          </div>
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-green"
                            }`}
                          ></span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
