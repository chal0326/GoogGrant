// src/types/store.ts
export interface Template {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
  }
  
  export interface Grant {
    id: string;
    title: string;
    content: string;
    sections: {
      id: string;
      title: string;
      content: string;
    }[];
    created_at: string;
  }
  
  export interface User {
    id: string;
    email: string;
  }
  
  export interface TemplateSlice {
    templates: Template[];
    isLoading: boolean;
    error: string | null;
    fetchTemplates: () => Promise<void>;
    addTemplate: (template: Omit<Template, 'id' | 'created_at'>) => Promise<void>;
    updateTemplate: (id: string, template: Partial<Template>) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
  }
  
  export interface GrantSlice {
    grants: Grant[];
    currentGrant: Grant | null;
    isLoading: boolean;
    error: string | null;
    fetchGrants: () => Promise<void>;
    setCurrentGrant: (grant: Grant | null) => void;
    saveGrant: (grant: Omit<Grant, 'id' | 'created_at'>) => Promise<void>;
    updateGrant: (id: string, grant: Partial<Grant>) => Promise<void>;
    deleteGrant: (id: string) => Promise<void>;
  }
  
  export interface AuthSlice {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    signOut: () => Promise<void>;
  }