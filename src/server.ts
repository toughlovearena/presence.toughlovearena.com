import cors from 'cors';
import express from 'express';
import simpleGit from 'simple-git';
import { PresenceTracker } from './presence';

export interface ServerEnv {
  label: string;
  path: string;
  presence: PresenceTracker;
}

export class Server {
  private app = express();

  constructor(gitHash: string, envs: ServerEnv[]) {
    const started = new Date();
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/health', async (req, res) => {
      const gitStatus = await simpleGit().status();
      const data = {
        gitHash,
        started,
        testid: 2,
        behind: gitStatus.behind,
        envs: envs.map(env => ({
          label: env.label,
          path: env.path,
        })),
      };
      res.send(data);
    });

    envs.forEach(env => {
      // used for health check
      this.app.get(env.path + '/', (req, res) => {
        res.send(env.presence.get());
      });
      // client calls every X mins
      this.app.post(env.path + '/:id/:ptype', (req, res) => {
        const { id, ptype } = req.params;
        env.presence.purge();
        env.presence.ping({ id, ptype });
        res.send(env.presence.get());
      });
    });
  }

  listen(port: number) {
    this.app.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.log(`server started at http://localhost:${port}`);
    });
  }
}
