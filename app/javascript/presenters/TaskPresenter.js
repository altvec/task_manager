import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';

export default new PropTypesPresenter(
  {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.shape(),
    assignee: PropTypes.shape(),
    state: PropTypes.string,
  },
  {
    title(task) {
      return `Task # ${this.id(task)} [${this.name(task)}]`;
    },
  },
);
