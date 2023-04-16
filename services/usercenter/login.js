import {
  request
} from '../../utils/request';

export function login(code, username, avatarURL, gender) {
  return request(
    '/login', {
      code: code,
      username: username,
      avatar_url: avatarURL,
      gender: gender,
    },
    'POST',
    false,
  );
}