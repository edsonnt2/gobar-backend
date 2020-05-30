import { celebrate, Segments, Joi } from 'celebrate';

export default {
  search: celebrate({
    [Segments.QUERY]: {
      search: Joi.string().required(),
    },
  }),
};
