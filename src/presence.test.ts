import { PresenceTracker, TimeKeeper } from "./presence";

export class FakeTimeKeeper implements TimeKeeper {
  private state = 0;
  _set(state: number) { this.state = state; }
  _increment(num?: number) { this.state += Math.floor(num || 1); }
  now() { return this.state; }
}

describe('presence', () => {
  let tk: FakeTimeKeeper;
  let pt: PresenceTracker;

  beforeEach(() => {
    tk = new FakeTimeKeeper();
    pt = new PresenceTracker(tk);
  });

  test('defaultTally is not empty', () => {
    expect(Object.keys(pt.defaultTally).length).toBe(1);
    expect(Object.values(pt.defaultTally)).toStrictEqual([0]);
    expect(pt.get()).toStrictEqual({
      ...pt.defaultTally,
    });
  });

  test('ping / purge / get', () => {
    pt.ping({ id: 'a', ptype: 'foo', });
    pt.ping({ id: 'b', ptype: 'bar', });
    pt.purge();
    expect(pt.get()).toStrictEqual({
      ...pt.defaultTally,
      foo: 1,
      bar: 1,
    });

    tk._increment(pt.TTL / 3);
    pt.ping({ id: 'c', ptype: 'foo', });
    pt.purge();
    expect(pt.get()).toStrictEqual({
      ...pt.defaultTally,
      foo: 2,
      bar: 1,
    });

    tk._increment(pt.TTL / 3);
    pt.ping({ id: 'a', ptype: 'baz', });
    pt.purge();
    expect(pt.get()).toStrictEqual({
      ...pt.defaultTally,
      foo: 1,
      bar: 1,
      baz: 1,
    });

    tk._increment(pt.TTL / 3 + 1);
    pt.purge();
    expect(pt.get()).toStrictEqual({
      ...pt.defaultTally,
      foo: 1,
      bar: 0,
      baz: 1,
    });
  });
});
