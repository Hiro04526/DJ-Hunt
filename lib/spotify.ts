import { Buffer } from "buffer"

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64")

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search`

// 1. Get Access Token (Valid for 1 hour)
async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  })

  return response.json()
}

// 2. Search Function
export async function searchSpotifyTracks(query: string) {
  const { access_token } = await getAccessToken()

  const url = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&type=track&limit=5`
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  const data = await response.json()
  
  // Format the messy Spotify data into something clean for your DB
  return data.tracks.items.map((track: any) => ({
    title: track.name,
    artist: track.artists.map((a: any) => a.name).join(", "),
    image_url: track.album.images[0]?.url, // High-res image
    spotify_link: track.external_urls.spotify,
  }))
}