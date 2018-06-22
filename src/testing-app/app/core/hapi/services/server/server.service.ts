import { Service, Inject, BootstrapLogger } from "@rxdi/core";
import { ExitHandlerService } from "@rxdi/core/services/exit-handler/exit-handler.service";
import { HAPI_SERVER, HAPI_PLUGINS } from "../../hapi.module.config";
import { Server, PluginBase, PluginNameVersion, PluginPackage } from "hapi";

export type PluginType<T> = (PluginBase<T> & (PluginNameVersion | PluginPackage))[];

@Service()
export class ServerService {

    constructor(
        @Inject(HAPI_SERVER) private server: Server,
        @Inject(HAPI_PLUGINS) private plugins: PluginType<any>,
        private logger: BootstrapLogger,
        private exitHandler: ExitHandlerService
    ) {
        this.exitHandler.errorHandler.subscribe(async () => await this.server.stop());
    }

    async start() {
        if (this.plugins.length) {
            this.registerPlugins(this.plugins);
        }
        try {
            await this.server.start();
        }
        catch (err) {
            throw new Error(err);
        }
        this.logger.log(
            `
            Server running at: http://${this.server.info.address}:${this.server.info.port},
            Environment: ${process.env.NODE_ENV || 'development'}
            `
        );
    }

    async registerPlugins<T>(plugins: PluginType<T>) {
        plugins.forEach(plugin => this.server.register(plugin))
    }

}