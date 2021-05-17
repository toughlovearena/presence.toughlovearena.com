import childProcess from 'child_process';
import fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';

export class Updater {
  private readonly timeout = 1 * 5 * 1000; // 1 minute
  private rebuilding = false;
  private testfile = fs.readFileSync('testfile').toString();

  async run() {
    if (this.rebuilding) { return; }

    const newTestfile = fs.readFileSync('testfile').toString();

    const sg: SimpleGit = simpleGit();
    const pullResult = await sg.pull();
    const changes = (pullResult.summary.changes > 0) || (newTestfile !== this.testfile);

    if (changes) {
      this.rebuilding = true;
      await childProcess.exec('npm run rebuild');
    }
  }

  cron() {
    setInterval(() => this.run(), this.timeout);
  }
}
