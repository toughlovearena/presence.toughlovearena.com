import childProcess from 'child_process';
import simpleGit, { SimpleGit } from 'simple-git';

export class Updater {
  private readonly timeout = 1 * 60 * 1000; // 1 minute
  private rebuilding = false;

  async run() {
    if (this.rebuilding) { return; }

    const sg: SimpleGit = simpleGit();
    const pullResult = await sg.pull();
    const changes = (pullResult.summary.changes > 0);

    if (changes) {
      this.rebuilding = true;
      await childProcess.spawn('npm run rebuild', {
        detached: true,
      });
    }
  }

  cron() {
    setInterval(() => this.run(), this.timeout);
  }
}
