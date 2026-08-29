import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { GlobalSiteContent, NavigationItem, FooterGroup } from '../types/cms';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';

interface GlobalContentContextType {
  content: GlobalSiteContent | null;
  navigation: NavigationItem[];
  footerGroups: FooterGroup[];
  loading: boolean;
  error: Error | null;
}

const GlobalContentContext = createContext<GlobalContentContextType | undefined>(undefined);

export function GlobalContentProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useFetch(api.getGlobalContent);

  const content = data?.content ?? null;
  const navigation = data?.navigation ?? [];
  const footerGroups = data?.footerGroups ?? [];

  useEffect(() => {
    if (content) {
      if (content.seoDefaultTitle) {
        document.title = content.seoDefaultTitle;
      }

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && content.seoDefaultDescription) {
        metaDescription.setAttribute('content', content.seoDefaultDescription);
      } else if (content.seoDefaultDescription) {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = content.seoDefaultDescription;
        document.head.appendChild(meta);
      }
    }
  }, [content]);

  return (
    <GlobalContentContext.Provider value={{ content, navigation, footerGroups, loading, error }}>
      {children}
    </GlobalContentContext.Provider>
  );
}

export function useGlobalContent() {
  const context = useContext(GlobalContentContext);
  if (context === undefined) {
    throw new Error('useGlobalContent must be used within a GlobalContentProvider');
  }
  return context;
}
