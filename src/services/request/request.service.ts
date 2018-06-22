import { Service } from '../../container';
import { Observable } from 'rxjs';
import { get as httpGet } from 'http';
import { get as httpsGet } from 'https';

@Service()
export class RequestService {
    get(link: string) {
        return new Observable((o) => {
            if (link.includes('https://')) {
                httpsGet(link, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => data += chunk);
                    resp.on('end', () => o.next(data));
                }).on('error', (err) => {
                    console.error('Error: ' + err.message);
                    o.error(err);
                });
            } else {
                httpGet(link, (resp) => {
                    let data = '';
                    resp.on('data', (chunk) => data += chunk);
                    resp.on('end', () => o.next(data));
                }).on('error', (err) => {
                    console.error('Error: ' + err.message);
                    o.error(err);
                });
            }
        });
    }
}
