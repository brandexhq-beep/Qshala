import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { isEventUpcoming } from '../src/lib/eventsStore.ts';

describe('Event Auto-Expiry and Filtering', () => {
  test('should keep events scheduled for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    const event = {
      id: 'future-1',
      title: 'Future Quiz Cup',
      category: 'School',
      date: futureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isoDate: futureDate.toISOString(),
      desc: 'Upcoming event',
      buttonType: 'register'
    };

    assert.equal(isEventUpcoming(event), true);
  });

  test('should keep events happening today until the day concludes', () => {
    const today = new Date();
    const event = {
      id: 'today-1',
      title: 'Today Live Showdown',
      category: 'Corporate',
      date: today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isoDate: today.toISOString(),
      desc: 'Happening today',
      buttonType: 'register'
    };

    assert.equal(isEventUpcoming(event), true);
  });

  test('should automatically filter out events whose date has passed', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);

    const event = {
      id: 'past-1',
      title: 'Old Quiz',
      category: 'Community',
      date: pastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isoDate: pastDate.toISOString(),
      desc: 'Past event',
      buttonType: 'none'
    };

    assert.equal(isEventUpcoming(event), false);
  });
});
