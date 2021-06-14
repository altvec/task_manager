import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';

export const STATES = [
  { taskState: 'new_task', value: 'New' },
  { taskState: 'in_development', value: 'In Dev' },
  { taskState: 'in_qa', value: 'In QA' },
  { taskState: 'in_code_review', value: 'In CR' },
  { taskState: 'ready_for_release', value: 'Ready for release' },
  { taskState: 'released', value: 'Released' },
  { taskState: 'archived', value: 'Archived' },
];

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
