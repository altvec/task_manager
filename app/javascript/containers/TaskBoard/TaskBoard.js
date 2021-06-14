import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import ColumnHeader from 'components/ColumnHeader';

import TaskPresenter from 'presenters/TaskPresenter';
import TasksRepository from 'repositories/TasksRepository';
import TaskForm from 'forms/TaskForm';

import useTasks from 'hooks/store/useTasks';
import useStyles from './useStyles';

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
  NONE: 'none',
};

const TaskBoard = () => {
  const styles = useStyles();
  const { board, loadBoard, loadColumn, loadColumnMore } = useTasks();
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

  useEffect(() => {
    loadBoard();
  }, []);

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClosePopup = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return TasksRepository.update(TaskPresenter.id(task), { stateEvent: transition.event })
      .then(() => {
        loadColumn(destination.toColumnId);
        loadColumn(source.fromColumnId);
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.serialize(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumn(TaskPresenter.state(task));
      setMode(MODES.NONE);
    });
  };

  const handleTaskLoad = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.serialize(task);
    return TasksRepository.update(TaskPresenter.id(task), attributes).then(() => {
      loadColumn(TaskPresenter.state(task));
      handleClosePopup();
    });
  };

  const handleTaskDestroy = (task) => {
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumn(TaskPresenter.state(task));
      handleClosePopup();
    });
  };

  return (
    <>
      <Fab onClick={handleOpenAddPopup} className={styles.addButton} color="primary" aria-label="add">
        <AddIcon />
      </Fab>

      <KanbanBoard
        disableColumnDrag
        onCardDragEnd={handleCardDragEnd}
        renderCard={(card) => <Task onClick={handleOpenEditPopup} task={card} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
      >
        {board}
      </KanbanBoard>

      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClosePopup} mode={mode} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onCardLoad={handleTaskLoad}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handleClosePopup}
          cardId={openedTaskId}
          mode={mode}
        />
      )}
    </>
  );
};

export default TaskBoard;
