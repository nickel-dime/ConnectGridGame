import React, {
  Fragment,
  useContext,
  useState,
  useEffect,
  forwardRef,
  useCallback,
} from "react";
export const NormalContext = React.createContext(null);
import { addNBAGuess, addNFLGuess } from "@/app/store/normalSlice";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import axios from "axios";

import { useId, useRef } from "react";
import Highlighter from "react-highlight-words";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { store } from "@/app/store/store";

function SearchIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z" />
    </svg>
  );
}

function useAutocomplete(boxId, setOpen) {
  let id = useId();
  let [autocompleteState, setAutocompleteState] = useState({});
  const [disabled, setDisabled] = useState(false);

  const dispatch = useAppDispatch();

  const getStuff = () => {
    const league = store.getState().league;
    const isEndless = store.getState().isEndless;
    if (league == "NBA") {
      if (isEndless) {
        return {
          guessesLeft: store.getState().nbaGuessesLeftEndless,
          previousGuesses: store.getState().nbaPlayerGuessedEndless,
          currentHints: store.getState().nbaHintsEndless,
        };
      } else {
        return {
          guessesLeft: store.getState().nbaGuessesLeftDaily,
          previousGuesses: store.getState().nbaPlayerGuessedDaily,
          currentHints: store.getState().nbaHintsDaily,
        };
      }
    } else if (league == "NFL") {
      if (isEndless) {
        return {
          guessesLeft: store.getState().nflGuessesLeftEndless,
          previousGuesses: store.getState().nflPlayerGuessedEndless,
          currentHints: store.getState().nflHintsEndless,
        };
      } else {
        return {
          guessesLeft: store.getState().nflGuessesLeftEndless,
          previousGuesses: store.getState().nflPlayerGuessedEndless,
          currentHints: store.getState().nflHintsDaily,
        };
      }
    } else {
      console.log(`Incorrect league ${league}`);
      return {
        guessesLeft: store.getState().nbaGuessesLeftDaily,
        previousGuesses: store.getState().nflPlayerGuessedEndless,
        currentHints: store.getState().nflHintsEndless,
      };
    }
  };

  const checkPlayer = async (player, boxId, callback_after) => {
    if (disabled) {
      return;
    }

    const { currentHints } = getStuff();

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        player: player,
        isEndless: store.getState().isEndless ? "1" : "0",
        hints: currentHints,
      }),
    };

    try {
      fetch(
        `/api/check/${store.getState().league.toLowerCase()}?boxId=${boxId}`,
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

  const calcURL = (query) => {
    var stringArray = query.split(/(\s+)/);

    if (query == "") {
      console.log("ERRRRROR");
      return;
    }

    var firstName = stringArray[0];

    if (stringArray.length > 1) {
      var lastName = stringArray[2];
      var url = `/api/players?firstName=${firstName}&lastName=${lastName}&league=${
        store.getState().league
      }`;
    } else {
      var url = `/api/players?firstName=${firstName}&league=${
        store.getState().league
      }`;
    }

    return url;
  };

  let [autocomplete] = useState(() =>
    createAutocomplete({
      id,
      placeholder: "Find something...",
      onStateChange({ state }) {
        setAutocompleteState(state);
      },
      shouldPanelOpen({ state }) {
        return state.query !== "";
      },
      async getSources({ query }) {
        return axios.get(calcURL(query)).then((resp) => {
          return [
            {
              sourceId: "documentation",
              getItems() {
                const { previousGuesses } = getStuff();

                for (const playerData of resp.data) {
                  // get prev guesses
                  var thisBoxGuesses = previousGuesses[boxId];
                  if (Array.isArray(thisBoxGuesses) && thisBoxGuesses.length) {
                    var item = thisBoxGuesses.find(
                      (player) => player["id"] === playerData["id"]
                    );
                  }

                  if (item == undefined) {
                    playerData["found"] = 0;
                  } else {
                    playerData["found"] = 2;
                  }
                }
                return resp.data;
              },
              async onSelect({
                state,
                item,
                refresh,
                setIsOpen,
                setStatus,
                setActiveItemId,
              }) {
                setStatus("stalled");
                setIsOpen(true);

                if (item["found"] > 0) {
                  return;
                }

                const { guessesLeft } = getStuff();

                setDisabled(true);

                checkPlayer(item, boxId, (correct) => {
                  if (store.getState().league == "NFL") {
                    dispatch(
                      addNFLGuess({
                        player: item,
                        boxId: boxId,
                        correct: correct,
                      })
                    );
                  } else if (store.getState().league == "NBA") {
                    dispatch(
                      addNBAGuess({
                        player: item,
                        boxId: boxId,
                        correct: correct,
                      })
                    );
                  }

                  if (correct) {
                    setOpen(false);
                  } else {
                    refresh();
                    setDisabled(false);
                    if (guessesLeft <= 1) {
                      setOpen(false);
                    }
                  }
                });
              },
            },
          ];
        });
      },
    })
  );

  return { autocomplete, autocompleteState };
}

function LoadingIcon(props) {
  let id = useId();

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HighlightQuery({ text, query, found }) {
  return (
    <Highlighter
      highlightClassName={`group-aria-selected:underline  bg-transparent ${
        found == 2 ? "text-red-500" : "text-green-500"
      }`}
      searchWords={[query]}
      autoEscape={true}
      textToHighlight={text}
    />
  );
}

function SearchResult({ result, autocomplete, collection, query }) {
  let id = useId();

  return (
    <li
      className="group block cursor-pointer rounded-lg px-3 py-2 aria-selected:bg-slate-100"
      aria-labelledby={`${id}-hierarchy ${id}-title`}
      {...autocomplete.getItemProps({
        item: result,
        source: collection.source,
      })}
    >
      <div
        id={`${id}-title`}
        aria-hidden="true"
        className={`text-md font-medium ${
          result.found == 2
            ? "text-red-500"
            : "text-slate-700 group-aria-selected:text-green-500 "
        }`}
      >
        <HighlightQuery
          text={`${result.firstName} ${result.lastName}`}
          query={query}
          found={result.found}
        />
      </div>
      <div className="text-sm text-gray-500">
        {result.yearStart} - {result.yearEnd}
      </div>
    </li>
  );
}

function SearchResults({ autocomplete, query, collection }) {
  if (collection.items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-700 ">
        No results for &ldquo;
        <span className="break-words text-slate-900">{query}</span>
        &rdquo;
      </p>
    );
  }

  return (
    <ul role="list" {...autocomplete.getListProps()}>
      {collection.items.map((result) => (
        <SearchResult
          key={result.id}
          result={result}
          autocomplete={autocomplete}
          collection={collection}
          query={query}
        />
      ))}
    </ul>
  );
}

const SearchInput = forwardRef(function SearchInput(
  { autocomplete, autocompleteState, onClose },
  inputRef
) {
  let inputProps = autocomplete.getInputProps({});

  return (
    <div className="group relative flex h-12 bg-white rounded-md">
      <SearchIcon className="pointer-events-none absolute left-4 top-0 h-full w-5 fill-slate-400" />
      <input
        ref={inputRef}
        className={clsx(
          "flex-auto appearance-none bg-transparent pl-12 text-slate-900 outline-none placeholder:text-slate-400 focus:w-full focus:flex-none sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
          autocompleteState.status === "stalled" ? "pr-11" : "pr-4"
        )}
        {...inputProps}
        onKeyDown={(event) => {
          if (
            event.key === "Escape" &&
            !autocompleteState.isOpen &&
            autocompleteState.query === ""
          ) {
            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
            document.activeElement?.blur();

            onClose();
          } else {
            inputProps.onKeyDown(event);
          }
        }}
      />
      {autocompleteState.status === "stalled" && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingIcon className="h-6 w-6 animate-spin stroke-slate-200 text-slate-400" />
        </div>
      )}
    </div>
  );
});

export function SearchDialog({ open, setOpen, boxId, className }) {
  let formRef = useRef();
  let panelRef = useRef();
  let inputRef = useRef();
  let { autocomplete, autocompleteState } = useAutocomplete(boxId, setOpen);

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        autocomplete.setQuery("");
      }}
      className={clsx("fixed inset-0 z-50", className)}
    >
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />

      <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
        <Dialog.Panel className="mx-auto transform-gpu overflow-hidden shadow-xl sm:max-w-md">
          <div {...autocomplete.getRootProps({})}>
            <form
              ref={formRef}
              {...autocomplete.getFormProps({
                inputElement: inputRef.current,
              })}
            >
              <SearchInput
                ref={inputRef}
                autocomplete={autocomplete}
                autocompleteState={autocompleteState}
                onClose={() => setOpen(false)}
              />
              <div
                ref={panelRef}
                className="border-t border-slate-200 bg-white px-2 py-3 empty:hidden mt-1 rounded-md max-h-80 overflow-auto"
                {...autocomplete.getPanelProps({})}
              >
                {autocompleteState.isOpen &&
                  autocompleteState.collections[0] && (
                    <SearchResults
                      autocomplete={autocomplete}
                      query={autocompleteState.query}
                      collection={autocompleteState.collections[0]}
                    />
                  )}
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export function useSearchProps(boxId) {
  let buttonRef = useRef();
  let [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen(open) {
        let { width, height } = buttonRef.current.getBoundingClientRect();
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      },
      boxId,
    },
  };
}
