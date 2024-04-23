import React, { useState } from "react";
import { Header } from "../components/header";
import { Stack } from "../components/stack";
import {
  AddressAutocomplete,
  AutocompleteResult,
} from "../components/address_autocomplete";

export const Root = () => {
  const [selection, setSelection] = useState<AutocompleteResult>();
  return (
    <>
      <Header />
      <Stack>
        <AddressAutocomplete onChange={setSelection} />
        {selection && (
          <div>Your weather for {selection.zip ?? selection.name}</div>
        )}
      </Stack>
    </>
  );
};
