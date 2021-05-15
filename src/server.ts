import cors from 'cors';
import express from 'express';
import fs from 'fs';
import { PresenceTracker } from './presence';

interface Version {
  v: number;
  u: number;
}

export interface ServerEnv {
  label: string;
  path: string;
  presence: PresenceTracker;
}

export class Server {
  private app = express();

  constructor(envs: ServerEnv[]) {
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/health', (req, res) => {
      const versionStr = fs.readFileSync('version.json').toString();
      const version = JSON.parse(versionStr) as Version;
      const data = envs.map(env => ({
        label: env.label,
        path: env.path,
        version: version.v,
      }));
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
