import supabase from "../supabaseAdmin.js";

/**
 * Middleware: validates the Supabase JWT Bearer token.
 * Attaches req.user (the verified Supabase user) to the request.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Validate the token with Supabase admin
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(500).json({ error: "Auth check failed" });
  }
};

/**
 * Helper: Ensures the authenticated user can only access their own data.
 * Usage: requireSelf(req.user.id, req.params.userId, res)
 */
export const requireSelf = (authUserId, requestedUserId, res) => {
  if (authUserId !== requestedUserId) {
    res.status(403).json({ error: "Forbidden: Cannot access other user's data" });
    return false;
  }
  return true;
};
