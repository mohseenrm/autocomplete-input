const getBaseUrl = (): string => {
  if (process.env.VERCEL_ENV !== "development" && !process.env.VERCEL_URL) {
    throw new Error("VERCEL_URL is not defined")
  }
  // @ts-ignore
  return process.env.VERCEL_ENV === "development"
    ? "http://localhost:3000"
    : process.env.VERCEL_URL
}
