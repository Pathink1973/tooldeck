import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  display_name?: string;
}

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initAuth: () => () => void;
}

async function fetchProfile(userId: string): Promise<User | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: profileData } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return {
    id: userData.user.id,
    email: userData.user.email || '',
    display_name: profileData?.display_name,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  error: null,

  initAuth: () => {
    // Get initial session without setting loading to true again
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(user => {
          set({ user, session, loading: false, initialized: true });
        }).catch(() => {
          set({ user: null, session: null, loading: false, initialized: true });
        });
      } else {
        set({ user: null, session: null, loading: false, initialized: true });
      }
    });

    // Listen for auth changes (token refresh, sign in/out from other tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        set({ user: null, session: null, loading: false });
        return;
      }

      if (session?.user) {
        // Use async block inside callback to avoid deadlocks
        (async () => {
          try {
            const { data: profileData } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            set({
              user: {
                id: session.user.id,
                email: session.user.email || '',
                display_name: profileData?.display_name,
              },
              session,
              loading: false,
            });
          } catch {
            // Keep existing user on profile fetch failure during token refresh
            if (get().user) {
              set({ session, loading: false });
            }
          }
        })();
      } else {
        set({ user: null, session: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  },

  signIn: async (email, password) => {
    try {
      set({ error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      set({
        user: {
          id: data.user.id,
          email: data.user.email || '',
          display_name: profileData?.display_name,
        },
        session: data.session,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  signUp: async (email, password) => {
    try {
      set({ error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await supabase
          .from('users')
          .insert([{ id: data.user.id, email: data.user.email }]);
      }

      set({
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          display_name: undefined,
        } : null,
        session: data.session,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  resetPassword: async (email) => {
    try {
      set({ error: null });
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  loadUser: async () => {
    // Only used as fallback — initAuth handles the primary flow
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (sessionData.session) {
        const user = await fetchProfile(sessionData.session.user.id);
        set({ user, session: sessionData.session, loading: false, initialized: true });
      } else {
        set({ user: null, session: null, loading: false, initialized: true });
      }
    } catch (error: any) {
      set({ user: null, session: null, loading: false, initialized: true, error: error.message });
    }
  },

  updateProfile: async (updates) => {
    try {
      set({ error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      set(state => ({
        user: state.user ? { ...state.user, ...profileData } : null,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
