// Middleware to check userId and active plan
export const auth = async (req, res, next) => {
  try {
    //  
    const authData = typeof req.auth === 'function' ? req.auth() : req.auth;
    const userId = authData?.userId;

    // 1. Block if user is not logged in
    if (!userId) {
      console.log("❌ Blocked: Unauthenticated request");
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }

    // 2. Extract Plan (Clerk's 'has' function)
    const has = authData?.has || (() => false);
    const hasPremiumPlan = Boolean(has({ plan: 'premium' }) || has({ role: 'pro' }));

    // 3. Attach data to request for our aiController to use
    req.user = { id: userId };
    req.plan = hasPremiumPlan ? 'pro' : 'free'; // 'pro' gives 50 credits, 'free' gives 5

    return next();
    
  } catch (error) {
    console.error("🚨 Auth Middleware Error:", error.message);
    
    return res.status(401).json({ success: false, error: 'Authentication failed' });
  }
}