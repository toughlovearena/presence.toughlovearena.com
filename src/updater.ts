import childProcess from 'child_process';
import simpleGit, { SimpleGit } from 'simple-git';

export class Updater {
  private readonly timeout = 1 * 10 * 1000; // 1 minute
  private rebuilding = false;

  async run() {
    if (this.rebuilding) { return; }

    const sg: SimpleGit = simpleGit();
    const pullResult = await sg.pull();
    if (pullResult.summary.changes > 0) {
      this.rebuilding = true;
      await childProcess.exec('npm run rebuild');
    }
  }

  cron() {
    setInterval(() => this.run(), this.timeout);
  }
}
