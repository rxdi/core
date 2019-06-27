import { Service } from '../../decorators/service/Service';
import { BootstrapLogger } from '../bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import { Observable, Subject } from 'rxjs';

export type NodejsEvents =
  | 'beforeExit'
  | 'disconnect'
  | 'exit'
  | 'rejectionHandled'
  | 'uncaughtException'
  | 'unhandledRejection'
  | 'warning'
  | 'message'
  | 'newListener'
  | 'removeListener';

export type Signals =
  | 'SIGABRT'
  | 'SIGALRM'
  | 'SIGBUS'
  | 'SIGCHLD'
  | 'SIGCONT'
  | 'SIGFPE'
  | 'SIGHUP'
  | 'SIGILL'
  | 'SIGINT'
  | 'SIGIO'
  | 'SIGIOT'
  | 'SIGKILL'
  | 'SIGPIPE'
  | 'SIGPOLL'
  | 'SIGPROF'
  | 'SIGPWR'
  | 'SIGQUIT'
  | 'SIGSEGV'
  | 'SIGSTKFLT'
  | 'SIGSTOP'
  | 'SIGSYS'
  | 'SIGTERM'
  | 'SIGTRAP'
  | 'SIGTSTP'
  | 'SIGTTIN'
  | 'SIGTTOU'
  | 'SIGUNUSED'
  | 'SIGURG'
  | 'SIGUSR1'
  | 'SIGUSR2'
  | 'SIGVTALRM'
  | 'SIGWINCH'
  | 'SIGXCPU'
  | 'SIGXFSZ'
  | 'SIGBREAK'
  | 'SIGLOST'
  | 'SIGINFO';

@Service()
export class ExitHandlerService {
  errorHandler: Subject<any> = new Subject();
  @Injector(BootstrapLogger) private logger: BootstrapLogger;

  init() {}

  exitHandler(options, err) {
    this.errorHandler.next(err);
    if (options.cleanup) {
      this.logger.logExitHandler('AppStopped');
    }
    if (err) console.log(err.stack);
    if (options.exit) {
      this.logger.logExitHandler('Unhandled error rejection');
    }
    process.exit(0);
  }

  onExitApp(events: Array<Signals>) {
    return new Observable(
      o =>
        events &&
        events.length &&
        events.forEach(event => process.on(event, e => o.next(e)))
    );
  }
}
