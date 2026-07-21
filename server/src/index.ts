import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 4000);

const santoriniItinerary = {
  id: 'santorini-escape',
  title: 'Santorini Escape',
  subtitle: '4 days · Jun 24 – Jun 28, 2026',
  days: [
    {
      id: 'day-1',
      label: 'Day 1',
      activities: [
        {
          id: 'pickup',
          time: '09:00',
          title: 'Airport Pickup',
          description: 'Private transfer to your hotel in Oia',
          accentColor: '#2e7df6',
          iconBackground: 'rgba(46, 125, 246, 0.12)',
          iconKey: 'clock',
          dotKey: 'dotBlue',
        },
        {
          id: 'beach',
          time: '11:30',
          title: 'Beach Morning',
          description: 'Relax at Red Beach with welcome drinks',
          accentColor: '#38bdf8',
          iconBackground: 'rgba(56, 189, 248, 0.12)',
          iconKey: 'beach',
          dotKey: 'dotCyan',
        },
        {
          id: 'village',
          time: '14:00',
          title: 'Village Tour',
          description: "Guided walk through Oia's iconic streets",
          accentColor: '#7c3aed',
          iconBackground: 'rgba(124, 58, 237, 0.12)',
          iconKey: 'city',
          dotKey: 'dotPurple',
        },
        {
          id: 'dinner',
          time: '19:30',
          title: 'Sunset Dinner',
          description: 'Caldera-view dinner at a rooftop restaurant',
          accentColor: '#f5a623',
          iconBackground: 'rgba(245, 166, 35, 0.12)',
          iconKey: 'star',
          dotKey: 'dotOrange',
        },
      ],
    },
    { id: 'day-2', label: 'Day 2', activities: [] },
    { id: 'day-3', label: 'Day 3', activities: [] },
    { id: 'day-4', label: 'Day 4', activities: [] },
  ],
};

app.use(cors());
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ ok: true });
});

app.get('/api/trips/:tripId/itinerary', (req: express.Request, res: express.Response) => {
  if (req.params.tripId !== santoriniItinerary.id) {
    res.status(404).json({ message: 'Trip not found' });
    return;
  }

  res.json(santoriniItinerary);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Wintrig API listening on http://localhost:${port}`);
});
