import simpleGit from 'simple-git';
import { PresenceTracker } from './presence';
import { Server, ServerEnv } from './server';
import { Updater } from './updater';

(async () => {
  const gitLog = await simpleGit().log();
  const gitHash = gitLog.latest.hash;

  const envs: ServerEnv[] = [{
    label: 'prod',
    path: '',
    presence: new PresenceTracker(),
  }, {
    label: 'beta',
    path: '/beta',
    presence: new PresenceTracker(),
  }];

  // start presence server
  new Server(gitHash, envs).listen(2700);
  new Updater().cron();
})();
