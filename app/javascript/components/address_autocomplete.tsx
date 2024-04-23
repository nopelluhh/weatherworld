import React, { useEffect, useRef } from "react";

function parseResult(place: google.maps.places.Place) {
  if (!place.location || !place.displayName || !place.addressComponents)
    throw new Error("Invalid place");

  return {
    lat: place.location.lat(),
    lng: place.location.lng(),
    name: place.displayName,
    zip:
      place.addressComponents.find((entry) =>
        entry.types.includes("postal_code")
      )?.shortText ?? undefined,
  };
}

export type AutocompleteResult = {
  zip?: string;
  name: string;
  lat: number;
  lng: number;
};

export const AddressAutocomplete = ({
  onChange,
}: {
  onChange: (result: AutocompleteResult) => void;
}) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    async function load() {
      await Promise.all([google.maps.importLibrary("places")]);
      const geocoder = new google.maps.Geocoder();
      const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement(
        { componentRestrictions: { country: "us" } }
      );

      placeAutocomplete.addEventListener("gmp-placeselect", async (event) => {
        const { place } =
          event as google.maps.places.PlaceAutocompletePlaceSelectEvent;
        await place.fetchFields({
          fields: ["addressComponents", "location", "displayName"],
        });
        onChange(parseResult(place));
      });
      inputRef.current?.appendChild(placeAutocomplete);
    }

    load();
  }, []);

  return (
    <div ref={inputRef}>
      <div>Find your address or zip code:</div>
    </div>
  );
};
