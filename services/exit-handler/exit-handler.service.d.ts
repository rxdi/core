import { Observable, Subject } from 'rxjs';
export declare type NodejsEvents = 'beforeExit' | 'disconnect' | 'exit' | 'rejectionHandled' | 'uncaughtException' | 'unhandledRejection' | 'warning' | 'message' | 'newListener' | 'removeListener';
export declare type Signals = 'SIGABRT' | 'SIGALRM' | 'SIGBUS' | 'SIGCHLD' | 'SIGCONT' | 'SIGFPE' | 'SIGHUP' | 'SIGILL' | 'SIGINT' | 'SIGIO' | 'SIGIOT' | 'SIGKILL' | 'SIGPIPE' | 'SIGPOLL' | 'SIGPROF' | 'SIGPWR' | 'SIGQUIT' | 'SIGSEGV' | 'SIGSTKFLT' | 'SIGSTOP' | 'SIGSYS' | 'SIGTERM' | 'SIGTRAP' | 'SIGTSTP' | 'SIGTTIN' | 'SIGTTOU' | 'SIGUNUSED' | 'SIGURG' | 'SIGUSR1' | 'SIGUSR2' | 'SIGVTALRM' | 'SIGWINCH' | 'SIGXCPU' | 'SIGXFSZ' | 'SIGBREAK' | 'SIGLOST' | 'SIGINFO';
export declare class ExitHandlerService {
    errorHandler: Subject<any>;
    private logger;
    init(): void;
    exitHandler(options: any, err: any): void;
    onExitApp(events: Array<Signals>): Observable<{}>;
}
