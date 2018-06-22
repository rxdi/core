import { Plugin, PluginInterface } from "@rxdi/core";
import { ServerService } from "../services/server/server.service";

@Plugin()
export class HapiPlugin implements PluginInterface {

  constructor(
    private server: ServerService
  ) { }

  async register() {
    return await this.server.start();
  }

}
