import React from 'react'

import PlaceList from '../components/PlaceList'

function UserPlaces() {
  const DUMMY_PLACES = [
    {
      id: 'p1',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://media.cnn.com/api/v1/images/stellar/prod/130802164459-skyscrapers-gallery-empire-state-building.jpg?q=w_3000,h_1955,x_0,y_0,c_fill',
      adress: '20 W 34th St, New York, NY 1001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584,
      },
      creator: 'u1'
    },
    {
      id: 'p2',
      title: 'Empire State Building',
      description: 'One of the most famous sky scrapers in the world!',
      imageUrl:
        'https://media.cnn.com/api/v1/images/stellar/prod/130802164459-skyscrapers-gallery-empire-state-building.jpg?q=w_3000,h_1955,x_0,y_0,c_fill',
      adress: '20 W 34th St, New York, NY 1001',
      location: {
        lat: 40.7484405,
        lng: -73.9878584,
      },
      creator: 'u2'
    },
  ]

  return <PlaceList items={DUMMY_PLACES} />
}

export default UserPlaces
