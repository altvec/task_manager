import { useSelector } from 'react-redux';

import { useTasksActions } from 'slices/TasksSlice';
import { STATES } from 'presenters/TaskPresenter';

const useTasks = () => {
  const board = useSelector((state) => state.TasksSlice.board);
  const { loadColumn, loadColumnMore } = useTasksActions();
  const loadBoard = () => Promise.all(STATES.map(({ taskState }) => loadColumn(taskState)));
  return {
    board,
    loadBoard,
    loadColumn,
    loadColumnMore,
  };
};

export default useTasks;
