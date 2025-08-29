import React, { createContext, useContext } from 'react';

export const ScrollContext = createContext({ scrollToHero: null });

export const useScroll = () => useContext(ScrollContext);

export const ScrollProvider = ScrollContext.Provider;
