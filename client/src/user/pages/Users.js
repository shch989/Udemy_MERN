import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'Seong Hyeon',
      image:
        'https://image.jtbcplus.kr/data/contents/jam_photo/202301/11/d4b19cb8-f1cd-4a0d-8c06-a12eef725d21.jpg',
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
