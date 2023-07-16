import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  forwardRef,
} from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
export const HomeContext = React.createContext(null);

const SearchPlayer = ({ setClose, setPlayerSelected, boxId }, ref) => {
  const { guessesLeft, setGuessesLeft, settings, hints } =
    useContext(HomeContext);

  const [selected, setSelected] = useState({});
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  let [previousGuesses, setPreviousGuesses] = useState([]);

  function loadPreviousGuesses() {
    let previousGuesses =
      localStorage.getItem(`${settings.league}previousGuesses${boxId}`) || "[]";
    previousGuesses = JSON.parse(previousGuesses);

    setPreviousGuesses(previousGuesses);
    return previousGuesses;
  }

  useEffect(() => {
    loadPreviousGuesses();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // setPeople([]);
    // split up query into first and last name
    var stringArray = query.split(/(\s+)/);

    if (query == "") {
      setPeople([]);
      setIsLoading(false);
      return;
    }

    var firstName = stringArray[0];

    if (stringArray.length > 1) {
      var lastName = stringArray[2];
      var url = `/api/players?firstName=${firstName}&lastName=${lastName}&league=${settings.league}`;
    } else {
      var url = `/api/players?firstName=${firstName}&league=${settings.league}`;
    }

    if (Array.isArray(previousGuesses) && previousGuesses.length == 0) {
      previousGuesses = loadPreviousGuesses();
    }

    fetch(url)
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => {
        for (const playerData of data) {
          if (Array.isArray(previousGuesses) && previousGuesses.length) {
            var item = previousGuesses.find(
              (player) => player["id"] === playerData["id"]
            );
          }

          if (item == undefined) {
            playerData["found"] = 0;
          } else if (item["correct"] == true) {
            playerData["found"] = 1;
          } else if (item["correct"] == false) {
            playerData["found"] = 2;
          }
        }

        setTimeout(setPeople(data), 1000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  const checkPlayer = async (player, boxId, callback_after) => {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        player: player,
        isEndless: settings.isEndless,
        hints: hints,
      }),
    };

    try {
      fetch(
        `/api/check/${settings.league.toLowerCase()}?boxId=${boxId}`,
        requestOptions
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          player["found"] = data["success"] ? 1 : 2;
          callback_after(data["success"]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="top-16 w-80 sm:w-96">
      <Combobox
        value={selected}
        onChange={(value) => {
          if (guessesLeft <= 0) {
            return;
          }

          setSelected(value);
          // make api call with value and box. if correct then setPlayerSelected and close else dont do either

          checkPlayer(value, boxId, (correct) => {
            if (correct) {
              value["correct"] = true;
              setPlayerSelected(value);
              setClose();
            } else {
              value["correct"] = false;
              // setSelected({});
            }
            setPreviousGuesses((oldArray) => [...oldArray, value]);
            let newArray = [...previousGuesses, value];
            localStorage.setItem(
              `${settings.league}previousGuesses${boxId}`,
              JSON.stringify(newArray)
            );

            setGuessesLeft(guessesLeft - 1);
            localStorage.setItem(
              `${settings.league}guessesLeft`,
              guessesLeft - 1
            );
          });
        }}
      >
        {({ open }) => (
          <div className="relative">
            <div className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-slate-100 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none outline-none py-2 pl-3 pr-10 text-[16px] sm:text-[14px] leading-5 text-gray-900 focus:ring-0 "
                displayValue={(person) => person.name}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                ref={ref}
                autoComplete="off"
                onFocus={(e) => {
                  console.log("FOCUSED");
                  if (
                    e.relatedTarget?.id?.includes("headlessui-combobox-button")
                  )
                    return;
                  !open && e.target.nextSibling.click();
                }}
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
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {people === undefined ||
                (people.length == 0 && (isLoading || query.length > 1)) ? (
                  <div className="relative cursor-default select-none py-4 px-4 text-gray-700">
                    {isLoading ? "Loading" : "Nothing found."}
                  </div>
                ) : (
                  people.map((person) => (
                    <Combobox.Option
                      key={person.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-4 ${
                          person.found == 2
                            ? " bg-slate-100 text-red-500"
                            : active
                            ? "bg-slate-50 text-purple"
                            : "text-gray-900"
                        }`
                      }
                      value={person}
                      disabled={person.found > 0}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`flex justify-between truncate text-left ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            <div className="text-sm sm:text-base">
                              <div className="font-medium">
                                {person.firstName} {person.lastName}
                              </div>
                              <div className=" text-gray-500">
                                {person.yearStart} - {person.yearEnd}
                              </div>
                            </div>
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-slate-100" : "text-purple"
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
        )}
      </Combobox>
    </div>
  );
};

export default forwardRef(SearchPlayer);
