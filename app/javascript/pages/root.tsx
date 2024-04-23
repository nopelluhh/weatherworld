import React, { useState } from "react";
import { Header } from "../components/header";
import { Stack } from "../components/stack";
import {
  AddressAutocomplete,
  AutocompleteResult,
} from "../components/address_autocomplete";
import { Forecast } from "../components/forecast";

export const Root = () => {
  const [selection, setSelection] = useState<AutocompleteResult>();
  return (
    <>
      <Header />
      <Stack>
        <AddressAutocomplete onChange={setSelection} />
        {selection && <Forecast selection={selection} />}
      </Stack>
    </>
  );
};
