import { ExitHandlerService } from '../services/exit-handler/exit-handler.service';
import { Container } from '../container';

export const exitHandlerInit = () => {
  const handler = Container.get(ExitHandlerService);
  handler.init();

  // do something when app is closing
  process.on('exit', handler.exitHandler.bind(handler, { cleanup: true }));
  // catches ctrl+c event
  process.on('SIGINT', handler.exitHandler.bind(handler, { exit: true }));
  // catches 'kill pid' (for example: nodemon restart)
  process.on('SIGUSR1', handler.exitHandler.bind(handler, { exit: true }));
  process.on('SIGUSR2', handler.exitHandler.bind(handler, { exit: true }));
  // catches uncaught exceptions
  process.on(
    'uncaughtException',
    handler.exitHandler.bind(handler, { exit: true })
  );
};
