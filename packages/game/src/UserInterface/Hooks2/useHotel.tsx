import { useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useHotel() {
  const [hotel, setHotel] = useState(clientInstance.hotel.value);
  const [_state, setState] = useState(clientInstance.hotel.state);

  useEffect(() => {
    return clientInstance.hotel.subscribe((hotel) => {
      setHotel(hotel);
      setState(clientInstance.hotel.state);
    });
  }, []);

  return hotel;
}
