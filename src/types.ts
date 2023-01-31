export type Address = {
  country: string
  country_code: string
  name: string
}

export interface Location {
  address: Address
  boundingbox: string[]
  class: string
  display_address: string
  display_name: string
  display_place: string
  lat: string
  licence: string
  lon: string
  osm_id: string
  osm_type: string
  place_id: string
  type: string
}

export type Option = {
  id: number | string
  label: string
}
