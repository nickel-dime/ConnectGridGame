import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { NFLPlayer, NBAPlayer, NBAHints, NFLHints } from "@prisma/client";
import { captureException } from "@sentry/nextjs";

// Define a type for the slice state
interface NormalState {
  nbaPlayerSelectedDaily: Partial<NBAPlayer | null>[]; // persist, and reset on new nbaHints
  nbaPlayerGuessedDaily: Partial<NBAPlayer>[][]; // persist and reset on new nbaHints
  nbaPlayerSelectedEndless: Partial<NBAPlayer | null>[]; // persist and reset on reset button
  nbaPlayerGuessedEndless: Partial<NBAPlayer>[][]; // persist and reset on reset button
  nbaHintsDaily: NBAHints[]; // reset everytime
  nbaHintsEndless: NBAHints[]; // persist and reset on reset button
  nbaGuessesLeftDaily: number; // persist and reset on new nba hints
  nbaGuessesLeftEndless: number;
  nbaLoaded: boolean;
  nflPlayerSelectedDaily: Partial<NFLPlayer | null>[]; // persist, and reset on new nflHints
  nflPlayerGuessedDaily: Partial<NFLPlayer>[][]; // persist and reset on new nflHints
  nflPlayerSelectedEndless: Partial<NFLPlayer | null>[]; // persist and reset on reset button
  nflPlayerGuessedEndless: Partial<NFLPlayer>[][]; // persist and reset on reset button
  nflHintsDaily: NFLHints[]; // reset everytime
  nflHintsEndless: NFLHints[]; // persist and reset on reset button
  nflGuessesLeftDaily: number; // persist and reset on new nflHints
  nflGuessesLeftEndless: number;
  nflLoaded: boolean;
  isEndless: boolean;
  league: String;
}

// Define the initial state using that type
const initialState: NormalState = {
  nbaPlayerSelectedDaily: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  nbaPlayerGuessedDaily: [[], [], [], [], [], [], [], [], []],
  nbaPlayerSelectedEndless: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  nbaPlayerGuessedEndless: [[], [], [], [], [], [], [], [], []],
  nbaHintsDaily: [],
  nbaHintsEndless: [],
  nbaGuessesLeftDaily: 9,
  nbaGuessesLeftEndless: 9,
  nbaLoaded: false,
  nflPlayerSelectedDaily: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  nflPlayerGuessedDaily: [[], [], [], [], [], [], [], [], []],
  nflPlayerSelectedEndless: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  nflPlayerGuessedEndless: [[], [], [], [], [], [], [], [], []],
  nflHintsDaily: [],
  nflHintsEndless: [],
  nflGuessesLeftDaily: 9,
  nflGuessesLeftEndless: 9,
  nflLoaded: false,
  isEndless: false,
  league: "NBA",
};

export const fetchNFLHintsDaily = createAsyncThunk(
  "normal/fetchNFLHintsDaily",
  async (thunkAPI) => {
    try {
      const response = await fetch("api/hints/nfl/normal?isEndless=0");
      const data = (await response.json()) as NFLHints[];
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
);

export const fetchNBAHintsDaily = createAsyncThunk(
  "normal/fetchNBAHintsDaily",
  async (thunkAPI) => {
    try {
      const response = await fetch("api/hints/nba/normal?isEndless=0");
      const data = (await response.json()) as NBAHints[];
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
);

export const fetchNBAHintsEndless = createAsyncThunk(
  "normal/fetchNBAHintsEndless",
  async (thunkAPI) => {
    try {
      const response = await fetch("api/hints/nba/normal?isEndless=1");
      const data = (await response.json()) as NBAHints[];
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
);

export const fetchNFLHintsEndless = createAsyncThunk(
  "normal/fetchNFLHintsEndless",
  async (thunkAPI) => {
    try {
      const response = await fetch("api/hints/nfl/normal?isEndless=1");
      const data = (await response.json()) as NFLHints[];
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
);

export const normalSlice = createSlice({
  name: "normal",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateSettings: (
      state,
      action: PayloadAction<{
        league: String | null;
        isEndless: boolean | null;
      }>
    ) => {
      if (action.payload.league != null) {
        state.league = action.payload.league;
      }
      if (action.payload.isEndless != null) {
        state.isEndless = action.payload.isEndless;
      }
      console.log(state.league);
    },
    addNFLGuess: (
      state,
      action: PayloadAction<{
        player: Partial<NFLPlayer>;
        boxId: number;
        correct: boolean;
      }>
    ) => {
      if (state.isEndless) {
        if (action.payload.correct) {
          state.nflPlayerSelectedEndless[action.payload.boxId] =
            action.payload.player;
        } else {
          state.nflPlayerGuessedEndless[action.payload.boxId].push(
            action.payload.player
          );
        }
        state.nflGuessesLeftEndless = state.nflGuessesLeftEndless - 1;
      } else {
        if (action.payload.correct) {
          state.nflPlayerSelectedDaily[action.payload.boxId] =
            action.payload.player;
        }
        state.nflPlayerGuessedDaily[action.payload.boxId].push(
          action.payload.player
        );
        state.nflGuessesLeftDaily = state.nflGuessesLeftDaily - 1;
      }
    },
    reset: (state) => {
      if (state.league == "NBA") {
        state.nbaGuessesLeftEndless = initialState.nbaGuessesLeftEndless;
        state.nbaPlayerSelectedEndless = initialState.nbaPlayerSelectedEndless;
        state.nbaPlayerGuessedEndless = initialState.nbaPlayerGuessedEndless;
      } else {
        state.nflGuessesLeftEndless = initialState.nflGuessesLeftEndless;
        state.nflPlayerSelectedEndless = initialState.nflPlayerSelectedEndless;
        state.nflPlayerGuessedEndless = initialState.nflPlayerGuessedEndless;
      }
    },
    addNBAGuess: (
      state,
      action: PayloadAction<{
        player: Partial<NBAPlayer>;
        boxId: number;
        correct: boolean;
      }>
    ) => {
      if (state.isEndless) {
        if (action.payload.correct) {
          state.nbaPlayerSelectedEndless[action.payload.boxId] =
            action.payload.player;
        } else {
          state.nbaPlayerGuessedEndless[action.payload.boxId].push(
            action.payload.player
          );
        }
        state.nbaGuessesLeftEndless = state.nbaGuessesLeftEndless - 1;
      } else {
        console.log(action.payload.correct);
        if (action.payload.correct) {
          state.nbaPlayerSelectedDaily[action.payload.boxId] =
            action.payload.player;
        } else {
          state.nbaPlayerGuessedDaily[action.payload.boxId].push(
            action.payload.player
          );
        }
        state.nbaGuessesLeftDaily = state.nbaGuessesLeftDaily - 1;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNFLHintsDaily.fulfilled, (state, action) => {
        // new daily challenge
        state.nflHintsDaily = action.payload;
        state.nflGuessesLeftDaily = 9;
        state.nflPlayerSelectedDaily = initialState.nflPlayerSelectedDaily;
        state.nflPlayerGuessedDaily = initialState.nflPlayerGuessedDaily;
        state.nflLoaded = true;
      })
      .addCase(fetchNFLHintsDaily.pending, (state, action) => {
        state.nflLoaded = false;
      })
      .addCase(fetchNFLHintsDaily.rejected, (state, action) => {
        state.nflLoaded = false;
        captureException(`Could not load NFL hints daily ${state} ${action}`);
      })
      .addCase(fetchNBAHintsDaily.fulfilled, (state, action) => {
        // new daily challenge
        state.nbaHintsDaily = action.payload;
        state.nbaGuessesLeftDaily = 9;
        state.nbaPlayerSelectedDaily = initialState.nbaPlayerSelectedDaily;
        state.nbaPlayerGuessedDaily = initialState.nbaPlayerGuessedDaily;
        state.nbaLoaded = true;
      })
      .addCase(fetchNBAHintsDaily.pending, (state, action) => {
        state.nbaLoaded = false;
      })
      .addCase(fetchNBAHintsDaily.rejected, (state, action) => {
        state.nbaLoaded = false;
        captureException(`Could not load NBA hints daily ${state} ${action}`);
      })
      .addCase(fetchNBAHintsEndless.fulfilled, (state, action) => {
        state.nbaHintsEndless = action.payload;
        state.nbaLoaded = true;
      })
      .addCase(fetchNBAHintsEndless.pending, (state, action) => {
        state.nbaLoaded = false;
      })
      .addCase(fetchNBAHintsEndless.rejected, (state, action) => {
        state.nbaLoaded = false;
        captureException(`Could not load NBA hints endless ${state} ${action}`);
      })
      .addCase(fetchNFLHintsEndless.fulfilled, (state, action) => {
        state.nflHintsEndless = action.payload;
        state.nflLoaded = true;
      })
      .addCase(fetchNFLHintsEndless.pending, (state, action) => {
        state.nflLoaded = false;
      })
      .addCase(fetchNFLHintsEndless.rejected, (state, action) => {
        state.nflLoaded = false;
        captureException(`Could not load NFL hints endless ${state} ${action}`);
      });
  },
});

export const { addNBAGuess, addNFLGuess, reset, updateSettings } =
  normalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getBoardState = createSelector(
  (state: RootState) => state.league,
  (state: RootState) => state.isEndless,
  (state: RootState) => state.nbaGuessesLeftEndless,
  (state: RootState) => state.nbaPlayerGuessedEndless,
  (state: RootState) => state.nbaPlayerSelectedEndless,
  (state: RootState) => state.nbaHintsEndless,
  (state: RootState) => state.nbaGuessesLeftDaily,
  (state: RootState) => state.nbaPlayerGuessedDaily,
  (state: RootState) => state.nbaPlayerSelectedDaily,
  (state: RootState) => state.nbaHintsDaily,
  (state: RootState) => state.nflGuessesLeftEndless,
  (state: RootState) => state.nflPlayerGuessedEndless,
  (state: RootState) => state.nflPlayerSelectedEndless,
  (state: RootState) => state.nflHintsEndless,
  (state: RootState) => state.nflGuessesLeftDaily,
  (state: RootState) => state.nflPlayerGuessedDaily,
  (state: RootState) => state.nflPlayerSelectedDaily,
  (state: RootState) => state.nflHintsDaily,
  (
    league,
    isEndless,
    nbaGuessesLeftEndless,
    nbaPlayerGuessedEndless,
    nbaPlayerSelectedEndless,
    nbaHintsEndless,
    nbaGuessesLeftDaily,
    nbaPlayerGuessedDaily,
    nbaPlayerSelectedDaily,
    nbaHintsDaily,
    nflGuessesLeftEndless,
    nflPlayerGuessedEndless,
    nflPlayerSelectedEndless,
    nflHintsEndless,
    nflGuessesLeftDaily,
    nflPlayerGuessedDaily,
    nflPlayerSelectedDaily,
    nflHintsDaily
  ) => {
    if (league == "NBA") {
      if (isEndless) {
        return {
          guessesLeft: nbaGuessesLeftEndless,
          previousGuesses: nbaPlayerGuessedEndless,
          playerSelected: nbaPlayerSelectedEndless,
          currentHints: nbaHintsEndless,
        };
      } else {
        return {
          guessesLeft: nbaGuessesLeftDaily,
          previousGuesses: nbaPlayerGuessedDaily,
          playerSelected: nbaPlayerSelectedDaily,
          currentHints: nbaHintsDaily,
        };
      }
    } else if (league == "NFL") {
      if (isEndless) {
        return {
          guessesLeft: nflGuessesLeftEndless,
          previousGuesses: nflPlayerGuessedEndless,
          playerSelected: nflPlayerSelectedEndless,
          currentHints: nflHintsEndless,
        };
      } else {
        return {
          guessesLeft: nflGuessesLeftDaily,
          previousGuesses: nflPlayerGuessedDaily,
          playerSelected: nflPlayerSelectedDaily,
          currentHints: nflHintsDaily,
        };
      }
    } else {
      console.log(`Incorrect league ${league}`);
      return {
        guessesLeft: initialState.nbaGuessesLeftDaily,
        previousGuesses: initialState.nflPlayerGuessedEndless,
        playerSelected: initialState.nflPlayerSelectedEndless,
        currentHints: initialState.nflHintsEndless,
      };
    }
  }
);

export const boardStateSelector = (state: RootState) => {
  console.log(`CALLING BOARD STATE`);
  // console.log(state);
  if (state.league == "NBA") {
    if (state.isEndless) {
      return {
        guessesLeft: state.nbaGuessesLeftEndless,
        previousGuesses: state.nbaPlayerGuessedEndless,
        playerSelected: state.nbaPlayerSelectedEndless,
        currentHints: state.nbaHintsEndless,
      };
    } else {
      return {
        guessesLeft: state.nbaGuessesLeftDaily,
        previousGuesses: state.nbaPlayerGuessedDaily,
        playerSelected: state.nbaPlayerSelectedDaily,
        currentHints: state.nbaHintsDaily,
      };
    }
  } else if (state.league == "NFL") {
    if (state.isEndless) {
      return {
        guessesLeft: state.nflGuessesLeftEndless,
        previousGuesses: state.nflPlayerGuessedEndless,
        playerSelected: state.nflPlayerSelectedEndless,
        currentHints: state.nflHintsEndless,
      };
    } else {
      return {
        guessesLeft: state.nflGuessesLeftEndless,
        previousGuesses: state.nflPlayerGuessedEndless,
        playerSelected: state.nflPlayerSelectedEndless,
        currentHints: state.nflHintsDaily,
      };
    }
  } else {
    console.log(`Incorrect league ${state.league}`);
    return {
      guessesLeft: initialState.nbaGuessesLeftDaily,
      previousGuesses: initialState.nflPlayerGuessedEndless,
      playerSelected: initialState.nflPlayerSelectedEndless,
      currentHints: initialState.nflHintsEndless,
    };
  }
};

export const loaded = (state: RootState) => {
  return state.nbaLoaded && state.nflLoaded;
};

export const getPlayer = (state: RootState, boxId: number) => {
  if (state.league == "NBA" && state.isEndless) {
    return state.nbaPlayerSelectedEndless[boxId];
  } else if (state.league == "NBA" && !state.isEndless) {
    return state.nbaPlayerSelectedDaily[boxId];
  } else if (state.league == "NFL" && !state.isEndless) {
    return state.nflPlayerSelectedDaily[boxId];
  } else if (state.league == "NFL" && state.isEndless) {
    return state.nflPlayerSelectedEndless[boxId];
  } else {
    console.log(`Error getting player ${boxId} ${state}`);
  }
};

export default normalSlice.reducer;
