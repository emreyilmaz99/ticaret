// src/features/users/components/UserList/UserAvatar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaUser } from 'react-icons/fa';
import { styles } from '../../shared/styles';

const UserAvatar = React.memo(({ user, size = 40 }) => {
  const avatarStyle = {
    ...styles.avatar,
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size / 2.5}px`,
  };

  return (
    <div style={avatarStyle}>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <FaUser />
      )}
    </div>
  );
});

UserAvatar.displayName = 'UserAvatar';

UserAvatar.propTypes = {
  user: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  size: PropTypes.number,
};

export default UserAvatar;
