import refreshToken from './refresh-token/schema.json';
import captcha from './captcha/schema.json';
import menu from './menu/schema.json';
import menuItem from './menu-item/schema.json';
import article from './article/schema.json';
import category from './category/schema.json';
import tag from './tag/schema.json';
import comment from './comment/schema.json';
import banner from './banner/schema.json';
import friendLink from './friend-link/schema.json';
import page from './page/schema.json';
import message from './message/schema.json';
import log from './log/schema.json';

export default {
  'refresh-token': {
    schema: refreshToken,
  },
  'captcha': {
    schema: captcha,
  },
  'menu': {
    schema: menu,
  },
  'menu-item': {
    schema: menuItem,
  },
  'article': {
    schema: article,
  },
  'category': {
    schema: category,
  },
  'tag': {
    schema: tag,
  },
  'comment': {
    schema: comment,
  },
  'banner': {
    schema: banner,
  },
  'friend-link': {
    schema: friendLink,
  },
  'page': {
    schema: page,
  },
  'message': {
    schema: message,
  },
  'log': {
    schema: log,
  },
};
