import { Service } from '../../container';
import { NpmPackageConfig } from '../external-importer';
import { BehaviorSubject } from 'rxjs';
import childProcess = require('child_process');

@Service()
export class NpmService {
    packagesToDownload: BehaviorSubject<NpmPackageConfig[]> = new BehaviorSubject([]);
    command: string = '';

    setPackages(packages: NpmPackageConfig[]) {
        this.packagesToDownload.next(packages);
    }

    preparePackages() {
        this.packagesToDownload.getValue().forEach((p) => this.command += `${p.name}@${p.version} `);
    }

    installPackages() {
        this.preparePackages();
        console.log(`Installing npm packages on child process! ${this.command}`);
        let child = null;
        if (child) {
            child.stdout.removeAllListeners('data');
            child.stderr.removeAllListeners('data');
            child.removeAllListeners('exit');
            child.kill();
        }

        child = childProcess.spawn('npm', ['i', this.command]);

        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        child.stderr.on('data', (data) => {
            process.stdout.write(data);
        });

        child.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
            console.log(`Installing npm packages DONE! ${this.command}`);
            child = null;
        });
    }

}