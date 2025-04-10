export const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Украсить окна',
      description: 'Наклеить бумажные цветы и бабочки на окна, использовать розовую и белую бумагу',
      difficulty: 0.4,
      timeEstimate: 2,
      deadline: {
        day: 12,
        month: 4
      },
      createdAt: "2025-04-02T00:00:00.000Z" // сегодня
    },
    'task-2': {
      id: 'task-2',
      title: 'Оформить стенгазету',
      description: 'Создать поздравительную стенгазету с фотографиями и пожеланиями для учителей',
      difficulty: 0.7,
      timeEstimate: 3,
      deadline: {
        day: 10,
        month: 4
      },
      createdAt: "2025-04-01T00:00:00.000Z"
    },
    'task-3': {
      id: 'task-3',
      title: 'Шары и гирлянды',
      description: 'Развесить воздушные шары и бумажные гирлянды под потолком',
      difficulty: 0.3,
      timeEstimate: 1,
      deadline: {
        day: 11,
        month: 4
      },
      createdAt: "2025-03-31T00:00:00.000Z"
    },
    'task-4': {
      id: 'task-4',
      title: 'Подготовить подарки',
      description: 'Организовать сбор денег и купить цветы и конфеты для учителей',
      difficulty: 0.8,
      timeEstimate: 4,
      deadline: {
        day: 9,
        month: 4
      },
      createdAt: "2025-03-30T00:00:00.000Z"
    },
    'task-5': {
      id: 'task-5',
      title: 'Украсить доску',
      description: 'Нарисовать весенние цветы и поздравления на классной доске цветными мелками',
      difficulty: 0.5,
      timeEstimate: 2,
      deadline: {
        day: 12,
        month: 4
      },
      createdAt: "2025-03-29T00:00:00.000Z"
    },
    'task-6': {
      id: 'task-6',
      title: 'Сделать фотозону',
      description: 'Создать красивый фон для фотографий с цветами и весенними мотивами',
      difficulty: 0.6,
      timeEstimate: 3,
      deadline: {
        day: 10,
        month: 4
      },
      createdAt: "2025-03-28T00:00:00.000Z"
    },
    'task-7': {
      id: 'task-7',
      title: 'Подготовить музыку',
      description: 'Составить плейлист с праздничными песнями и проверить колонки',
      difficulty: 0.2,
      timeEstimate: 1,
      deadline: {
        day: 11,
        month: 4
      },
      createdAt: "2025-03-27T00:00:00.000Z"
    },
    'task-8': {
      id: 'task-8',
      title: 'Оформить дверь',
      description: 'Украсить дверь класса бумажными цветами и поздравительными надписями',
      difficulty: 0.4,
      timeEstimate: 2,
      deadline: {
        day: 12,
        month: 4
      },
      createdAt: "2025-03-26T00:00:00.000Z"
    },
    'task-9': {
      id: 'task-9',
      title: 'Организовать чаепитие',
      description: 'Распределить кто что принесет и подготовить посуду для чаепития',
      difficulty: 0.5,
      timeEstimate: 2,
      deadline: {
        day: 12,
        month: 4
      },
      createdAt: "2025-03-25T00:00:00.000Z"
    },
    'task-10': {
      id: 'task-10',
      title: 'Подготовить сценарий',
      description: 'Написать сценарий поздравления учителей с распределением ролей',
      difficulty: 0.7,
      timeEstimate: 3,
      deadline: {
        day: 10,
        month: 4
      },
      createdAt: "2025-03-24T00:00:00.000Z"
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Нужно сделать',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
    },
    'column-2': {
      id: 'column-2',
      title: 'В процессе',
      taskIds: ['task-5', 'task-6', 'task-7']
    },
    'column-3': {
      id: 'column-3',
      title: 'Готово',
      taskIds: ['task-8', 'task-9', 'task-10']
    }
  },
  columnOrder: ['column-1', 'column-2', 'column-3']
};
