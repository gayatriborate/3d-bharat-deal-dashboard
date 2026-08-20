"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { hydrateInterests } from "./slices/interestsSlice";

function HydrateInterests({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      dispatch(hydrateInterests());
      hydrated.current = true;
    }
  }, [dispatch]);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <HydrateInterests>{children}</HydrateInterests>
      </ThemeProvider>
    </Provider>
  );
}
