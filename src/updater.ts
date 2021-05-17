import simpleGit, { SimpleGit } from 'simple-git';

export class Updater {
  readonly timeout = 1 * 60 * 1000; // 1 minute
  private readonly gitHash: string;

  constructor(gitHash: string) {
    this.gitHash = gitHash;
  }

  run() {
    const sg: SimpleGit = simpleGit();
    // sg.exec(() => console.log('Starting pull...'))
    //   .pull((err, update) => {
    //     if (update && update.summary.changes) {
    //       require('child_process').exec('npm restart');
    //     }
    //   })
    //   .exec(() => console.log('pull done.'));
  }

  cron() {
    setInterval(() => this.run(), this.timeout);
  }
}
