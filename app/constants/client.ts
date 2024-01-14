"use client"

export const getBaseUrl = (): string => {
  const host = window.location.host
  const protocol = window.location.protocol
  const port = window.location.port
  return `${protocol}//${host}${port ? `:${port}` : ""}`
}
