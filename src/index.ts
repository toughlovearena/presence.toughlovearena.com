import { PresenceTracker } from './presence';
import { Server, ServerEnv } from './server';

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
const server = new Server(envs);
server.listen(2700);
