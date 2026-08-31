const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-do-not-use-in-production";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "JWT_SECRET environment variable is required in production. " +
        "Set it in your host's environment settings before deploying.",
    );
  }
  console.warn(
    "⚠️  JWT_SECRET is not set. Using an insecure development-only secret. " +
      "Set JWT_SECRET in your .env file before deploying to production.",
  );
}

module.exports = JWT_SECRET || DEV_FALLBACK_SECRET;
