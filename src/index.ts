import { Updater } from '@toughlovearena/updater';
import { PresenceTracker } from './presence';
import { Server, ServerEnv } from './server';

(async () => {
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
  const updater = new Updater();
  new Server(updater, envs).listen(2700);
  updater.cron();
})();
