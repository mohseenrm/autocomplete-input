"use client"

export const getBaseUrl = (): string => {
  const host = window.location.host
  const protocol = window.location.protocol
  return `${protocol}//${host}`
}

export const getPosterUrl = (posterPath: string): string => {
  return `https://image.tmdb.org/t/p/original${posterPath}`
}

export const STALE_TIME = 1000 * 60 * 60 * 24 * 365 // 1 year
