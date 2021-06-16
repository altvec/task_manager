import React, { useEffect, useState } from 'react';
import { propOr } from 'ramda';
import KanbanBoard from '@lourenci/react-kanban';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TasksRepository from 'repositories/TasksRepository';
import TaskForm from 'forms/TaskForm';
import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'In CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
  NONE: 'none',
};

const TaskBoard = () => {
  const styles = useStyles();
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setTaskIdOpened] = useState(null);

  const handleAddPopupOpen = () => {
    setMode(MODES.ADD);
  };

  const handleEditPopupOpen = (task) => {
    setTaskIdOpened(TaskPresenter.id(task));
    setMode(MODES.EDIT);
  };

  const handlePopupClose = () => {
    setMode(MODES.NONE);
    setTaskIdOpened(null);
  };

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => {
        const { cards } = prevState[state];
        return {
          ...prevState,
          [state]: { cards: [...cards, ...data.items], meta: data.meta },
        };
      });
    });
  };

  const generateBoard = () => {
    const generatedBoard = {
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr([], 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    };
    setBoard(generatedBoard);
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.serialize(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(TaskPresenter.state(task));
      setMode(MODES.NONE);
    });
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(TaskPresenter.id(task), {
      stateEvent: transition.event,
    })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(`Move failed! ${error.message}`);
      });
  };

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.serialize(task);

    return TasksRepository.update(TaskPresenter.id(task), attributes).then(() => {
      loadColumnInitial(TaskPresenter.state(task));
      handlePopupClose();
    });
  };

  const handleTaskDestroy = (task) => {
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumnInitial(TaskPresenter.state(task));
      handlePopupClose();
    });
  };

  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  return (
    <>
      <KanbanBoard
        disableColumnDrag
        onCardDragEnd={handleCardDragEnd}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        renderCard={(card) => <Task onClick={handleEditPopupOpen} task={card} />}
      >
        {board}
      </KanbanBoard>
      <Fab className={styles.addButton} color="primary" aria-label="add" onClick={handleAddPopupOpen}>
        <AddIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCardCreate={handleTaskCreate} onClose={handlePopupClose} mode={mode} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onCardLoad={loadTask}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handlePopupClose}
          cardId={openedTaskId}
          mode={mode}
        />
      )}
    </>
  );
};

export default TaskBoard;
