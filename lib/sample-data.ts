export const timeSeriesData = [
  {
    name: 'Series A',
    values: Array.from({ length: 100 }, (_, i) => ({
      date: new Date(2023, 0, i + 1),
      value: Math.random() * 100 + 50,
    })),
  },
  {
    name: 'Series B',
    values: Array.from({ length: 100 }, (_, i) => ({
      date: new Date(2023, 0, i + 1),
      value: Math.random() * 80 + 40,
    })),
  },
  {
    name: 'Series C',
    values: Array.from({ length: 100 }, (_, i) => ({
      date: new Date(2023, 0, i + 1),
      value: Math.random() * 60 + 30,
    })),
  },
];

export const barRaceData = Array.from({ length: 50 }, (_, step) => {
  return ['A', 'B', 'C', 'D', 'E'].map((category) => ({
    category,
    value: Math.random() * 100,
    step,
  }));
});

export const networkData = {
  nodes: Array.from({ length: 30 }, (_, i) => ({
    id: `node${i}`,
    group: Math.floor(Math.random() * 5),
  })),
  links: Array.from({ length: 50 }, () => {
    const source = Math.floor(Math.random() * 30);
    let target;
    do {
      target = Math.floor(Math.random() * 30);
    } while (target === source);
    return {
      source: `node${source}`,
      target: `node${target}`,
      value: Math.random(),
    };
  }),
};