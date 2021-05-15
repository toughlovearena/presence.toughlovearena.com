interface PresencePing {
  ptype: string;
  id: string;
}
interface PresenceRecord extends PresencePing {
  updated: number;
}

interface PresenceLookup {
  [id: string]: PresenceRecord;
}
interface PresenceTally {
  [ptype: string]: number;
}

export interface TimeKeeper {
  now(): number;
}

export class PresenceTracker {
  readonly TTL = 5 * 60 * 1000; // 5 minutes
  private readonly lookup: PresenceLookup = {};
  private readonly tally: PresenceTally = {
    welcome: 0,
  };
  private readonly tk: TimeKeeper;

  constructor(tk?: TimeKeeper) {
    this.tk = tk || {
      now: () => new Date().getTime(),
    };
  }

  private removeRecord(record: PresenceRecord) {
    delete this.lookup[record.id];
    this.tally[record.ptype] -= 1;
  }
  purge() {
    const cutoff = this.tk.now() - this.TTL;
    const records = Object.values(this.lookup);
    const toDelete = records.filter(r => r.updated < cutoff);
    toDelete.forEach(r => this.removeRecord(r));
  }
  ping(ping: PresencePing) {
    const existing = this.lookup[ping.id];
    if (existing) {
      this.removeRecord(existing);
    }
    this.lookup[ping.id] = {
      ...ping,
      updated: this.tk.now(),
    };
    this.tally[ping.ptype] = (this.tally[ping.ptype] || 0) + 1;
  }
  get() {
    return this.tally;
  }
}
