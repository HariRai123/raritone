import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getProfile,
  loginUser as loginApi,
  logoutUser as logoutApi,
  updateProfile as updateProfileApi,
} from "../services/authService";

const AuthContext = createContext(null);

function readStoredUser() {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

function readStoredToken() {
  return localStorage.getItem("token");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(readStoredToken);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     CHECK AUTHENTICATION
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        if (mounted) {
          setToken(null);
          setUser(null);
          setLoading(false);
        }

        return;
      }

      try {
        const data = await getProfile();

        if (!mounted) return;

        setToken(savedToken);
        setUser(data?.user || null);

        localStorage.setItem("token", savedToken);

        if (data?.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user),
          );
        }
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error.response?.data || error.message,
        );

        if (!mounted) return;

        const status = error.response?.status;

        if (status === 401 || status === 403) {
          try {
            await logoutApi();
          } catch (logoutError) {
            console.error(
              "Logout API error:",
              logoutError,
            );
          }

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     LOGIN
  ========================================================= */

  const login = async (credentials) => {
    const data = await loginApi(credentials);

    if (!data?.token || !data?.user) {
      throw new Error(
        "Invalid login response from server.",
      );
    }

    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user),
    );

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const updateUserProfile = async (formData) => {
    const data = await updateProfileApi(formData);

    if (!data?.user) {
      throw new Error(
        "Invalid profile update response.",
      );
    }

    setUser(data.user);

    localStorage.setItem(
      "user",
      JSON.stringify(data.user),
    );

    return data;
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error(
        "Logout API error:",
        error,
      );
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    }
  };

  /* =========================================================
     CONTEXT VALUE
  ========================================================= */

  const value = useMemo(
    () => ({
      user,
      token,
      loading,

      isAuthenticated: Boolean(
        token && user,
      ),

      isAdmin:
        user?.role === "admin",

      login,
      logout,
      updateUserProfile,
    }),
    [
      user,
      token,
      loading,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}