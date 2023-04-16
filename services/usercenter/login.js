import {
  request
} from '../../utils/request';

export function login(code, username, avatar_url, gender) {
  return request(
    '/login', {
      code,
      username,
      avatar_url,
      gender,
    },
    'POST',
    false,
  );
}